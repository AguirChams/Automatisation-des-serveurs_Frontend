import React from 'react';
import WithPermission from '../private-route/WithPermission';

const Application = () => {
  return (
    <div className='application'>
      <h1 style={{textAlign: 'center'}}>Application</h1>
      <WithPermission roleRequired='OWNER' message='Successful operation'>

        {/* Content to show if user has required role */}
      </WithPermission>
      <WithPermission roleRequired='ADMIN' message='Successful operation'>
        {/* Content to show if user has required role */}
      </WithPermission>
      <WithPermission roleRequired='DEVELOPER' message='Successful operation'>
        {/* Content to show if user has required role */}
      </WithPermission>

    </div>
  );
};

export default Application;