require 'digest'

class ForemanSeeder
  FOREMAN_INTERNAL_KEY = 'database_seed'.freeze
  ADVISORY_LOCK = 0x7b5b5e3c0549a95c  # random Int64, should probably saved centrally

  attr_reader :seeds

  class << self
    attr_accessor :is_seeding
  end

  def initialize
    @seeds = (foreman_seeds + plugin_seeds).sort_by { |seed| seed.split("/").last }
    @hashed_files = @seeds + templates
  end

  def foreman_seeds
    Dir.glob(Rails.root + 'db/seeds.d/*.rb')
  end

  def plugin_seeds
    Foreman::Plugin.registered_plugins.collect do |name, plugin|
      engine = (name.to_s.tr('-', '_').camelize + '::Engine').constantize
      Dir.glob(engine.root + 'db/seeds.d/*.rb')
    rescue NameError => e
      Foreman::Logging.exception("Failed to register plugin #{name}", e)
      nil
    end.flatten.compact
  end

  def templates
    SeedHelper.report_templates + SeedHelper.provisioning_templates + SeedHelper.partition_tables_templates
  end

  def hash
    hashes = @hashed_files.collect { |seed| Digest::SHA256.file(seed).base64digest }
    Digest::SHA256.base64digest(hashes.join)
  end

  def execute
    Rails.logger.info("Acquiring Advisory-Lock 0x#{ADVISORY_LOCK.to_s(16)} for seeding")
    ActiveRecord::Base.connection.select_value("SELECT pg_advisory_lock(#{ADVISORY_LOCK})")

    # if we had to wait for the look it is likely that the seeding has already been done
    return unless hash_changed?

    self.class.is_seeding = true
    begin
      @seeds.each do |seed|
        Rails.logger.info("Seeding #{seed}") unless Rails.env.test?

        admin = User.unscoped.find_by_login(User::ANONYMOUS_ADMIN)
        # anonymous admin does not exist until some of seed step creates it, therefore we use it only when it exists
        if admin.present?
          User.as_anonymous_admin do
            load seed
          end
        else
          load seed
        end
      end
    ensure
      self.class.is_seeding = false
    end
    save_hash

    Rails.logger.info("All seed files executed") unless Rails.env.test?
  ensure
    ActiveRecord::Base.connection.select_value("SELECT pg_advisory_unlock(#{ADVISORY_LOCK})")
  end

  def save_hash
    ForemanInternal.find_or_create_by(key: FOREMAN_INTERNAL_KEY).update_attribute(:value, hash)
  end

  def old_hash
    ForemanInternal.find_or_create_by(key: FOREMAN_INTERNAL_KEY).value
  end

  def hash_changed?
    old_hash != hash
  end
end
