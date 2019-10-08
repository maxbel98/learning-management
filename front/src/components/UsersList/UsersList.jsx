import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllUsers } from '../../redux/Users/actions';
import { Image, List, Header } from 'semantic-ui-react';


class UsersList extends Component {

  componentDidMount() {
    this.props.getUsers();
  }

  render() {

    return (
      <List className="ui massive relaxed animated list usersList">
        {this.props.users ? this.props.users.map((e, i) =>
          <List.Item key={`${i}user`} className="item">
            <List.Content className="content">
              <Header as='a'>
                <Image className="ui avatar image" src={`/images/${e.photo}`} />
                <Header.Content>
                  {e.nickname}
                  <Header.Subheader >{e.group}</Header.Subheader>
                </Header.Content>
              </Header>
            </List.Content>
          </List.Item>
        ) : <></>}
      </List>

    )

  }

}

const mapStateToProps = (state) => {
  return {
    users: state.User.users,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {

    getUsers: () => dispatch(getAllUsers())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersList)