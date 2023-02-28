class TemplateKind < ApplicationRecord
  extend FriendlyId
  friendly_id :name
  validates_lengths_from_database
  has_many :provisioning_templates, :inverse_of => :template_kind
  has_many :os_default_templates
  validates :name, :presence => true, :uniqueness => true
  scoped_search :on => :id, :complete_enabled => false, :only_explicit => true, :validator => ScopedSearch::Validators::INTEGER
  scoped_search :on => :name

  PXE = Foreman::Provision::PXE_TEMPLATE_KINDS

  def self.default_template_labels
    {
      "PXELinux" => N_("PXELinux template"),
      "PXEGrub" => N_("PXEGrub template"),
      "PXEGrub2" => N_("PXEGrub2 template"),
      "PXEGrub2TargetOS" => N_("PXEGrub2 SecureBoot target OS template"),
      "iPXE" => N_("iPXE template"),
      "provision" => N_("Provisioning template"),
      "finish" => N_("Finish template"),
      "script" => N_("Script template"),
      "user_data" => N_("User data template"),
      "ZTP" => N_("ZTP PXE template"),
      "POAP" => N_("POAP PXE template"),
      "cloud-init" => N_("Cloud-init template"),
      "host_init_config" => N_("Host initial configuration template"),
      "registration" => N_("Registration template"),
      "kexec" => N_("Discovery Kexec"),
      "Bootdisk" => N_("Boot disk"),
    }
  end

  def self.default_template_descriptions
    @@template_description ||= {
      "PXELinux" => N_("Used when PXELinux loader is set, loads pxelinux.0 which loads content generated by this template."),
      "PXEGrub" => N_("Used when Grub2 loader is set, loads grub/bootx64.efi which loads content generated by this template."),
      "PXEGrub2" => N_("Used when PXELinux loader is set, loads grub/grubx64.efi which loads content generated by this template."),
      "PXEGrub2TargetOS" => N_("Used when PXELinux loader is set, loads target OS grubx64.efi which loads content generated by this template."),
      "iPXE" => N_("Used in iPXE environments."),
      "provision" => N_("Template for OS installer, for example kickstart, preseed or jumpstart. Depends on the operating system."),
      "finish" => N_("Post-install script for preseed-based or cloud instance. Connection is made via SSH, credentials or key must exist and inventory IP address must match. Only used when 'user data' is not set."),
      "script" => N_("An arbitrary script, must be manually downloaded using wget/curl."),
      "user_data" => N_("Template with seed data for virtual or cloud instances when 'user data' flag is set, typically cloud-init or ignition format."),
      "ZTP" => N_("Provisioning Junos devices (Junos 12.2+)."),
      "POAP" => N_("Provisioning for switches running NX-OS."),
      "cloud-init" => N_("Template for cloud-init unattended endpoint."),
      "host_init_config" => N_("Contains the instructions in form of a bash script for the initial host configuration, after the host is registered in Foreman"),
    }
  end

  def self.plugin_template_labels
    Foreman::Plugin.all.map(&:get_template_labels).inject({}, :merge)
  end

  def humanized_name
    [self.class.default_template_labels[name], self.class.plugin_template_labels[name]].detect(&:present?)
  end

  def to_label
    return _(humanized_name) if humanized_name.present?
    name
  end
end
