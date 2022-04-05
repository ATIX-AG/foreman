import React from 'react';
import PropTypes from 'prop-types';

import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';

import LabelIcon from '../../../../../components/common/LabelIcon';

import { translate as __ } from '../../../../../common/I18n';
import { emptyOption } from '../../RegistrationCommandsPageHelpers';

const HttpProxy = ({
  httpProxyId,
  httpProxies,
  handleHttpProxy,
  isLoading,
  isDisabled,
  hostGroupId,
  smartProxyId, 
}) => (
  <FormGroup
    label={__('HTTP proxy')}
    fieldId="reg_http_proxy"
    labelIcon={
      <LabelIcon
        text={__(
          'Only HTTP proxies with enabled `Templates` and `Registration` features are displayed.'
        ) }
      />
    }
  >
    <FormSelect
      value={httpProxyId}
      onChange={v => handleHttpProxy(v)}
      className="without_select2"
      id="reg_http_proxy"
      isDisabled={isLoading || httpProxies.length === 0 || (smartProxyId !== '' && smartProxyId !== undefined)}
    >
      {emptyOption(httpProxies.length)}
      {httpProxies.map((hp, i) => (
        <FormSelectOption key={i} value={hp.id} label={hp.name} />
      ))}
    </FormSelect>
  </FormGroup>
);

HttpProxy.propTypes = {
  httpProxyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleHttpProxy: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  httpProxies: PropTypes.array,
  isDisabled: PropTypes.bool,
  smartProxyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

HttpProxy.defaultProps = {
  httpProxyId: '',
  httpProxies: [],
  isDisabled: false,
};

export default HttpProxy;
