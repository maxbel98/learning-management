import { GET_SELECTED_TESTS, REQUEST_ALL_TESTS, REQUESTED_FAILED } from './types';
import axios from 'axios';

const requestTests = data => {
  return {
    type: REQUEST_ALL_TESTS,
    tests: data,
  };
};

const requestSelectedTests = data => {
  return {
    type: GET_SELECTED_TESTS,
    selectedGroupList: data.groupNames,
    selectedGroupTests: data.selectedGroupTests,
  };
};

const requestErrorAC = () => {
  return { type: REQUESTED_FAILED };
};

const getSelectedTests = selectedGroup => async dispatch => {
  try {
    const resp = await axios.post('/get-tests', { groupName: selectedGroup });
    dispatch(requestSelectedTests(resp.data));
  } catch (error) {}
};

const getAllTests = group => async dispatch => {
  try {
    const resp = await fetch('/get-tests');
    const data = await resp.json();
    dispatch(requestTests(data));
  } catch (error) {
    dispatch(requestErrorAC());
  }
};
const addTest = data => async dispatch => {
  try {
    await fetch('/addtest', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    dispatch(requestErrorAC());
  }
};

export { getAllTests, getSelectedTests, addTest };
