import PropTypes from 'prop-types';
import React from 'react';
import {
  ClipboardCopy,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Divider,
} from '@patternfly/react-core';
import { translate as __ } from '../../../../../../common/I18n';
import CardTemplate from '../../../../Templates/CardItem/CardTemplate';
import Slot from '../../../../../common/Slot';
import SkeletonLoader from '../../../../../common/SkeletonLoader';
import DefaultLoaderEmptyState from '../../../../DetailsCard/DefaultLoaderEmptyState';
import { STATUS } from '../../../../../../constants';
import { useForemanSettings } from '../../../../../../Root/Context/ForemanContext';

const SystemPropertiesCard = ({ status, hostDetails }) => {
  const { displayFqdnForHosts } = useForemanSettings();
  const {
    name,
    model_name: model,
    location_name: location,
    organization_name: organization,
    owner_name: ownerName,
    domain_name: domain,
    hostgroup_title: hostgroupTitle,
    owner_type: ownerType,
  } = hostDetails;
  return (
    <CardTemplate
      overrideGridProps={{ rowSpan: 2 }}
      header={__('System properties')}
      expandable
      masonryLayout
    >
      <DescriptionList isCompact>
        <DescriptionListGroup>
          <DescriptionListTerm>{__('Name')}</DescriptionListTerm>
          <DescriptionListDescription>
            <SkeletonLoader
              status={status}
              emptyState={<DefaultLoaderEmptyState />}
            >
              {name && (
                <ClipboardCopy
                  isBlock
                  variant="inline-compact"
                  hoverTip={__('Copy to clipboard')}
                  clickTip={__('Copied to clipboard')}
                >
                  {displayFqdnForHosts ? name : name?.replace(`.${domain}`, '')}
                </ClipboardCopy>
              )}
            </SkeletonLoader>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <Slot
          id="host-details-tab-properties-1"
          multi
          hostDetails={hostDetails}
        />
      </DescriptionList>
      <Divider className="padded-divider" />
      <DescriptionList isCompact isHorizontal>
        <DescriptionListGroup>
          <DescriptionListTerm>{__('Domain')}</DescriptionListTerm>
          <DescriptionListDescription>
            <SkeletonLoader
              status={status}
              emptyState={<DefaultLoaderEmptyState />}
            >
              {domain && (
                <ClipboardCopy isBlock variant="inline-compact">
                  {domain}
                </ClipboardCopy>
              )}
            </SkeletonLoader>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>{__('Model')}</DescriptionListTerm>
          <DescriptionListDescription>
            <SkeletonLoader
              status={status}
              emptyState={<DefaultLoaderEmptyState />}
            >
              {model}
            </SkeletonLoader>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <Slot
          id="host-details-tab-properties-2"
          multi
          hostDetails={hostDetails}
        />
        <DescriptionListGroup>
          <DescriptionListTerm>{__('Host group')}</DescriptionListTerm>
          <DescriptionListDescription>
            <SkeletonLoader
              status={status}
              emptyState={<DefaultLoaderEmptyState />}
            >
              {hostgroupTitle}
            </SkeletonLoader>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{__('Host owner')}</DescriptionListTerm>
          <DescriptionListDescription>
            <SkeletonLoader
              status={status}
              emptyState={<DefaultLoaderEmptyState />}
            >
              {ownerName}
            </SkeletonLoader>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{__('Owner type')}</DescriptionListTerm>
          <DescriptionListDescription>
            <SkeletonLoader
              status={status}
              emptyState={<DefaultLoaderEmptyState />}
            >
              {ownerType}
            </SkeletonLoader>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{__('Organization')}</DescriptionListTerm>
          <DescriptionListDescription>
            <SkeletonLoader
              status={status}
              emptyState={<DefaultLoaderEmptyState />}
            >
              {organization}
            </SkeletonLoader>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{__('Location')}</DescriptionListTerm>
          <DescriptionListDescription>
            <SkeletonLoader
              status={status}
              emptyState={<DefaultLoaderEmptyState />}
            >
              {location}
            </SkeletonLoader>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <Slot
          id="host-details-tab-properties-3"
          multi
          hostDetails={hostDetails}
        />
      </DescriptionList>
    </CardTemplate>
  );
};

SystemPropertiesCard.propTypes = {
  status: PropTypes.string,
  hostDetails: PropTypes.shape({
    hostgroup_title: PropTypes.string,
    model_name: PropTypes.string,
    organization_name: PropTypes.string,
    location_name: PropTypes.string,
    owner_name: PropTypes.string,
    owner_type: PropTypes.string,
    name: PropTypes.string,
    domain_name: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }),
};

SystemPropertiesCard.defaultProps = {
  status: STATUS.PENDING,
  hostDetails: {
    name: undefined,
    model_name: undefined,
    organization_name: undefined,
    location_name: undefined,
    hostgroup_title: undefined,
    owner_type: undefined,
    owner_name: undefined,
    domain_name: undefined,
    created_at: undefined,
    updated_at: undefined,
  },
};

export default SystemPropertiesCard;
