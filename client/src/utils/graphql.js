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
      phone
      address
      registrationDate
      role {
        id
        name
      }
      userStatus
      userMeta {
        metaKey
        metaValue
      }
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
      phone
      address
      registrationDate
      role {
        id
        name
      }
      userStatus
      userMeta {
        metaKey
        metaValue
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $password: String!, $role: ID!, $email: String, $fullname: String, $address: String, $phone: String, $userMeta: String) {
    createUser(username: $username, password: $password, role: $role, email: $email, fullname: $fullname, address: $address, phone: $phone, userMeta: $userMeta) {
      id
      username
      fullname
      email
      phone
      address
      registrationDate
      role {
        id
        name
      }
      userStatus
      userMeta {
        metaKey
        metaValue
      }
    }
  }
`;

export const EDIT_USER = gql`
  mutation editUser($id: ID! $password: String, $email: String, $role: ID, $fullname: String, $address: String, $phone: String, $userMeta: String) {
    editUser(id: $id, password: $password, email: $email, role: $role, fullname: $fullname, address: $address, phone: $phone, userMeta: $userMeta) {
      id
      username
      fullname
      email
      phone
      address
      registrationDate
      role {
        id
        name
      }
      userStatus
      userMeta {
        metaKey
        metaValue
      }
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
      user {
        id
        username
        fullname
      }
      price
      currency
      duration
      registerDate
      status
      transferMoney {
        id
        amount
        interestRate
        date
        status,
        withdrawDate
      }
    }
  }
`;

export const CREATE_PACKAGE = gql`
  mutation createPackage($userId: ID!, $price: Float!, $duration: PackageDuration!, $registerDate: String) {
    createPackage(userId: $userId, price: $price, duration: $duration, registerDate: $registerDate) {
      id
      user {
        id
        username
        fullname
      }
      price
      duration
      registerDate
      status
    }
  }
`;

export const EDIT_PACKAGE = gql`
  mutation editPackage($id: ID!, $userId: ID, $price: Float, $duration: PackageDuration, $registerDate: String, $status: PackageStatus) {
    editPackage(id: $id, userId: $userId, price: $price, duration: $duration, registerDate: $registerDate, status: $status) {
      id
      user {
        id
        username
        fullname
      }
      price
      duration
      registerDate
      status
      transferMoney {
        id
        amount
        interestRate
        date
        status
        withdrawDate
      }
    }
  }
`;

export const REMOVE_PACKAGE = gql`
  mutation removePackage($id: ID!) {
    removePackage(id: $id)
  }
`;

export const EDIT_PACKAGE_PROGRESS = gql`
  mutation editPackageProgress($id: ID!, $amount: Float, $interestRate: Int, $date: String, $status: Boolean, $withdrawDate: String) {
    editPackageProgress(id: $id, amount: $amount, interestRate: $interestRate, date: $date, status: $status, withdrawDate: $withdrawDate) {
      id
      user {
        id
        username
        fullname
      }
      price
      currency
      duration
      registerDate
      status
      transferMoney {
        id
        amount
        interestRate
        date
        status
        withdrawDate
      }
    }
  }
`;

export const ACTIVE_PACKAGE = gql`
  {
    activePackage {
      id
      user {
        id
        username
        fullname
      }
      price
      currency
      duration
      registerDate
      status
      transferMoney {
        id
        amount
        interestRate
        date
        status
        withdrawDate
      }
    }
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
        accessPermission
      }
      registrationDate
    }
  }
`;