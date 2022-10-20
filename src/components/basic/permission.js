import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import store from '../../store/store';

const ShowForPermissionComponent = (props) => {
    return props.userInfo?.is_manager ? props.children : null;
};


const mapStateToProps = state => ({
    userInfo: state.user?.info
});

const ShowForPermission = connect(mapStateToProps)(ShowForPermissionComponent);
export default ShowForPermission