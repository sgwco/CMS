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
        id
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
      phone
      address
      email
      role {
        id
        name
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $password: String!, $email: String!, $role: ID!, $fullname: String, $address: String, $phone: String) {
    createUser(username: $username, password: $password, email: $email, role: $role, fullname: $fullname, address: $address, phone: $phone) {
      id
      username
      fullname
      email
      registrationDate
      role {
        id
        name
      }
      userStatus
    }
  }
`;

export const EDIT_USER = gql`
  mutation editUser($id: ID! $password: String, $email: String, $role: ID, $fullname: String, $address: String, $phone: String) {
    editUser(id: $id, password: $password, email: $email, role: $role, fullname: $fullname, address: $address, phone: $phone) {
      id
      username
      fullname
      email
      registrationDate
      role {
        id
        name
      }
      userStatus
    }
  }
`;

export const REMOVE_USER = gql`
  mutation removeUser($id: ID!) {
    removeUser(id: $id)
  }
`;

export const GET_FULL_POSTS = gql`
  {
    posts {
      id
      title
      content
      excerpt
      author {
        id
        username
      }
      slug
      category {
        id
        name
      }
      thumbnail
      count
      publishDate
    }
  }
`;

export const CREATE_POST = gql`
  mutation createPost($title: String!, $content: String!, $excerpt: String, $author: ID!, $slug: String, $category: String, $thumbnail: String, $count: Int ) {
    createPost(title: $title, content: $content, excerpt: $excerpt, author: $author, slug: $slug, category: $category, thumbnail: $thumbnail, count: $count) {
      id
      title
      content
      excerpt
      author {
        id
        username
      }
      slug
      category {
        id
        name
      }
      thumbnail
      count
      publishDate
    }
  }
`;

export const EDIT_POST = gql`
  mutation editPost($id: ID!, $title: String!, $content: String!, $excerpt: String, $author: ID, $slug: String, $category: String, $thumbnail: String, $count: Int ) {
    editPost(id: $id, title: $title, content: $content, excerpt: $excerpt, author: $author, slug: $slug, category: $category, thumbnail: $thumbnail, count: $count) {
      id
      title
      content
      excerpt
      author {
        id
        username
      }
      slug
      category {
        id
        name
      }
      thumbnail
      count
      publishDate
    }
  }
`;

export const REMOVE_POST = gql`
  mutation removePost($id: ID!) {
    removePost(id: $id)
  }
`;


export const GET_FULL_CATEGORIES = gql`
  {
    categories {
      id
      name
      slug
      parent
      description
      thumbnail
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation createCategory($name: String!, $slug: String, $parent: String, $description: String, $thumbnail: String ) {
    createCategory(name: $name, slug: $slug, parent: $parent, description: $description, thumbnail: $thumbnail ) {
      id
      name
      slug
      parent
      description
      thumbnail
    }
  }
`;

export const EDIT_CATEGORY = gql`
  mutation editCategory($id: ID!, $name: String!, $slug: String, $parent: String, $description: String, $thumbnail: String ) {
    editCategory(id:$id, name: $name, slug: $slug, parent: $parent, description: $description, thumbnail: $thumbnail ) {
      id
      name
      slug
      parent
      description
      thumbnail
    }
  }
`;

export const REMOVE_CATEGORY = gql`
  mutation removeCategory($id: ID!) {
    removeCategory(id: $id)
  }
`;

export const GET_ALL_PACKAGES = gql`
{
  packages {
    id
    name
    price
    interestRate
  }
}
`;

export const CREATE_PACKAGE = gql`
  mutation createPackage($name: String!, $price: Float!, $interestRate: Float!) {
    createPackage(name: $name, price: $price, interestRate: $interestRate) {
      id
      name
      price
      interestRate
    }
  }
`;

export const EDIT_PACKAGE = gql`
  mutation editPackage($id: ID!, $name: String, $price: Float, $interestRate: Float) {
    editPackage(id: $id, name: $name, price: $price, interestRate: $interestRate) {
      id
      name
      price
      interestRate
    }
  }
`;

export const REMOVE_PACKAGE = gql`
  mutation removePackage($id: ID!) {
    removePackage(id: $id)
  }
`;

export const GET_ALL_SUBSCRIPTIONS = gql`
{
  subscriptions {
    id
    user {
      id
      fullname
    }
    package {
      id
      name
    }
    duration
    subscribeDate
    status
  }
}
`;

export const CREATE_SUBSCRIPTION = gql`
  mutation createSubscription($user: String!, $package: String!, $duration: Int!, $subscribeDate: String, $status: String) {
    createSubscription(userId: $userId, packageId: $packageId, duration: $duration, subscribeDate: $subscribeDate, status: $status) {
      id
      user {
        id
        fullname
      }
      package {
        id
        name
      }
      duration
      subscribeDate
      status
    }
  }
`;

export const EDIT_SUBSCRIPTION = gql`
  mutation editSubscription($id: ID!, $user: String, $package: String, $duration: Int, $subscribeDate: String, $status: String) {
    editSubscription(id: $id, userId: $userId, packageId: $packageId, duration: $duration, subscribeDate: $subscribeDate, status: $status) {
      id
      user {
        id
        fullname
      }
      package {
        id
        name
      }
      duration
      subscribeDate
      status
    }
  }
`;

export const REMOVE_SUBSCRIPTION = gql`
  mutation removeSubscription($id: ID!) {
    removeSubscription(id: $id)
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

export const GET_USER_TOKEN = gql`
  {
    loggedInUser {
      username
      fullname
      role {
        name
      }
      registrationDate
    }
  }
`;