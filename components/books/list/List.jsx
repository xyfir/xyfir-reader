import React from 'react';

// Components
import SubGroups from 'components/books/list/SubGroups';
import All from 'components/books/list/all/All';

export default props => {
  const view = props.App.state.view.split('/')[2];

  switch (view) {
    case 'AUTHORS':
      return <SubGroups {...props} group="creator" />;
    default:
      return <All {...props} />;
  }
};
