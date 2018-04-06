import gql from 'graphql-tag';

export function GET_ROLES(fields) {
  return gql`
    {
      roles {
        ${fields.join('\n')}
      }
    }
  `;
}

export const GET_ROLE_BY_ID = gql`
  query role($id: ID!) {
    role(id: $id) {
      id
      name
      accessPermission
    }
  }
`;

export const CREATE_ROLE = gql`
  mutation createRole($name: String!, $accessPermission: Int!) {
    createRole(name: $name, accessPermission: $accessPermission) {
      id
      name
      accessPermission
    }
  }
`;

export const EDIT_ROLE = gql`
  mutation editRole($id: ID!, $name: String, $accessPermission: Int) {
    editRole(id: $id, name: $name, accessPermission: $accessPermission) {
      id
      name
      accessPermission
    }
  }
`;

export const REMOVE_ROLE = gql`
  mutation removeRole($id: ID!) {
    removeRole(id: $id)
  }
`;

export const GET_FULL_USERS = gql`
  {
    users {
      id
      username
      fullname
      email
      registrationDate
      role {
        name
      }
      userStatus
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      username
      fullname
      email
      role {
        id
      }
      address
      phone
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $password: String!, $email: String!, $role: ID!, $fullname: String, $address: String, $phone: String) {
    createUser(username: $username, password: $password, email: $email, role: $role, fullname: $fullname, address: $address, phone: $phone) {
      id
    }
  }
`;

export const REMOVE_USER = gql`
  mutation removeUser($id: ID!) {
    removeUser(id: $id)
  }
`;