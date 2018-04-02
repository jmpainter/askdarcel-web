import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';
import { Tooltip } from 'react-tippy';
import { OrganizationCard, ServiceCard } from './index'
import 'react-tippy/dist/tippy.css';

class ListingTitle extends React.Component {
  getTooltipContent() {
    const { type, listing } = this.props;
    switch (type) {
      case 'org': return (<OrganizationCard org={listing} />);
      case 'service': return (<ServiceCard service={listing} />);
      default: throw new Error('unknown listing type');
    }
  }

  getListingLink() {
    const { type, listing } = this.props;
    switch (type) {
      case 'org': return `/resource?id=${listing.id}`;
      case 'service': return `/services/${listing.id}`;
      default: throw new Error('unknown listing type')
    }
  }

  render() {
    const { children } = this.props;
    return (
      <Tooltip
        arrow
        className="popover"
        hideDelay={100000}
        html={(this.getTooltipContent())}
        theme="light"
      >
        <Link to={this.getListingLink()}>{ children }</Link>
      </Tooltip>
    );
  }
}

ListingTitle.propTypes = {
  type: PropTypes.oneOf(['org', 'service']).isRequired, // TODO PROGRAM
  listing: PropTypes.object.isRequired,
};

export default ListingTitle;
