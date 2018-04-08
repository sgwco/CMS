import React from 'react';
import { Row, Col, Form, Input, FormGroup, Label, Button, Alert } from 'reactstrap';
import styled from 'styled-components';
import { withHandlers, compose } from 'recompose';

import { ALERT_STATUS, roleCapabilities } from '../../../commons/enum';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../shared/boxWrapper';

const AdminContentRolesFormComponent = ({
  breadcrumbItems,
  renderTopTitle,
  alertVisible,
  alertContent,
  removeAlert,
  renderRole,
  roleName,
  setRoleName,
  checkboxSelectAll,
  selectAllRoles,
  listRoles,
  saveRole
}) => (
  <Form onSubmit={e => { e.preventDefault(); saveRole(); }}>
    <ContentContainer>
      <ContentHeader>
        <h1>{renderTopTitle()}</h1>
        <Breadcrumb items={breadcrumbItems} />
      </ContentHeader>
      <ContentBody>
        <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
          {alertContent}
        </Alert>
        <BoxWrapper color="primary" title="Role Capabilities">
          <BoxBody>
            <Row>
              <Col sm={{ size: 6, offset: 3 }}>
                <FormGroup row>
                  <Label for="name" sm={3}>Role Name</Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Username"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={3}>Role Capabilities</Label>
                  <Col sm={9}>
                    <SelectAllRowStyled>
                      <Col sm={12}>
                        <Label check>
                          <Input type="checkbox" checked={checkboxSelectAll} onClick={selectAllRoles} />
                          Select all
                        </Label>
                      </Col>
                    </SelectAllRowStyled>
                    <Row>
                      {listRoles.map(renderRole)}
                    </Row>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </BoxBody>
          <BoxFooter>
            <Button color="primary" type="submit" className="float-right">Save</Button>
          </BoxFooter>
        </BoxWrapper>
      </ContentBody>
    </ContentContainer>
  </Form>
);

const SelectAllRowStyled = styled(Row)`
  margin-bottom: 15px;
`;

export default compose(
  withHandlers({
    renderRole: ({ selectRole }) => (item, index) => {
      const roleComponent = (
        <Col key={index} md={4} sm={12}>
          <Label check>
            <Input
              type="checkbox"
              checked={roleCapabilities[item] === true}
              onClick={selectRole}
              data-role={item}
            />
            {roleCapabilities[item].title}
          </Label>
        </Col>
      );
      return roleComponent;
    }
  })
)(AdminContentRolesFormComponent);

// class AdminContentRolesFormComponent extends React.Component {
//   static propTypes = {
//     isEditedUser: PropTypes.bool
//   }

//   static defaultProps = {
//     isEditedUser: false
//   }

//   listRoles = Object.keys(roleCapabilities);

//   constructor(props) {
//     super(props);

//     this.state = {
//       roleName: '',
//       roleCapabilities: {},
//       alertVisible: ALERT_STATUS.HIDDEN,
//       checkboxSelectAll: false,
//     };
//   }

//   async componentWillMount() {
//     const { isEditedUser, client, match, history } = this.props;
//     if (isEditedUser) {
//       try {
//         const { data } = await client.query({
//           query: GET_ROLE_BY_ID,
//           variables: { id: match.params.id }
//         });
//         const roles = {};
//         let checkboxSelectAll = false;

//         for (let index = 0; index < this.listRoles.length; index += 1) {
//           if (this.checkRoleAllowed(data.role.accessPermission, roleCapabilities[this.listRoles[index]].value)) {
//             roles[this.listRoles[index]] = true;
//           }
//         }

//         if (Object.keys(roles).length === this.listRoles.length) {
//           checkboxSelectAll = true;
//         }

//         this.setState({ roleName: data.role.name, roleCapabilities: roles, checkboxSelectAll });
//       }
//       catch (e) {
//         history.push('/admin/role');
//       }
//     }
//   }

//   checkRoleAllowed = (permission, role) => {
//     return permission & role;
//   }

//   renderTopTitle = () => this.props.isEditedUser ? 'Edit Role' : 'Add New Role';

//   onDismissAlert = () => this.setState({ alertVisible: ALERT_STATUS.HIDDEN });
//   triggerErrorCallback = () => this.setState({ alertVisible: ALERT_STATUS.ERROR });
//   triggerSuccessCallback = () => this.setState({
//     roleName: '',
//     roleCapabilities: {},
//     checkboxSelectAll: false,
//     alertVisible: ALERT_STATUS.SUCCESS
//   });
  
//   selectRole = (event) => {
//     const roleCapabilities = Object.assign({}, this.state.roleCapabilities);
//     const { role } = event.target.dataset;
//     const availableRoles = Object.keys(roleCapabilities);

//     roleCapabilities[role] = roleCapabilities[role] ? !roleCapabilities[role] : true;
//     const checkboxUnselectedRole = this.listRoles.findIndex(role => roleCapabilities[role] === false);

//     this.setState({
//       roleCapabilities,
//       checkboxSelectAll: checkboxUnselectedRole === -1 && availableRoles.length === this.listRoles.length
//     });
//   }

//   selectAllRoles = () => {
//     const roleCapabilities = Object.assign({}, this.state.roleCapabilities);
//     for (let index = 0; index < this.listRoles.length; index += 1) {
//       roleCapabilities[this.listRoles[index]] = !this.state.checkboxSelectAll;
//     }

//     this.setState({ checkboxSelectAll: !this.state.checkboxSelectAll, roleCapabilities });
//   }

//   saveRole = async (roleMutation) => {
//     const { isEditedUser, match } = this.props;
//     let accessPermission = 0;

//     for (let index = 0; index < this.listRoles.length; index += 1) {
//       if (this.state.roleCapabilities[this.listRoles[index]])
//         accessPermission += roleCapabilities[this.listRoles[index]].value;
//     }
//     const variables = {
//       name: this.state.roleName,
//       accessPermission
//     };

//     if (isEditedUser) variables.id = match.params.id;

//     roleMutation({ variables });
//   }

//   updateRoleCache = (cache, { data }) => {
//     try {
//       const { roles } = cache.readQuery({ query: GET_ROLES(['id', 'name', 'accessPermission']) });
      
//       if (this.props.isEditedUser) {
//         const index = roles.findIndex(item => item.id === data.editRole.id);
//         roles[index] = data.editRole;
//       }
//       else {
//         roles.push(data.createRole);
//       }
      
//       cache.writeQuery({ query: GET_ROLES(['id', 'name', 'accessPermission']), data: { roles } });
//     }
//     catch (e) {
//       // Do nothing
//     }
//   }

//   renderRole = (item, index) => {
//     return (
//       <Col key={index} md={4} sm={12}>
//         <Label check>
//           <Input
//             type="checkbox"
//             checked={this.state.roleCapabilities[item] === true}
//             onClick={this.selectRole}
//             data-role={item}
//           />
//           {roleCapabilities[item].title}
//         </Label>
//       </Col>
//     );
//   }

//   render() {
//     const { isEditedUser } = this.props;
//     return (
//       <Mutation
//         mutation={!isEditedUser ? CREATE_ROLE : EDIT_ROLE}
//         onError={this.triggerErrorCallback}
//         onCompleted={this.triggerSuccessCallback}
//         update={this.updateRoleCache}
//       >
//         {(roleMutation, { error }) => (
//           <Form onSubmit={e => { e.preventDefault(); this.saveRole(roleMutation); }}>
//             <section className="content-header">
//               <h1>
//                 {this.renderTopTitle()}
//               </h1>
//               <Breadcrumb>
//                 <BreadcrumbItem>
//                   <Link to='/admin'><FontAwesome icon="home" /> Home</Link>
//                 </BreadcrumbItem>
//                 <BreadcrumbItem>
//                   <Link to="/admin/role"><FontAwesome icon="users" /> Role</Link>
//                 </BreadcrumbItem>
//                 <BreadcrumbItem active>{this.renderTopTitle()}</BreadcrumbItem>
//               </Breadcrumb>
//             </section>
//             <section className="content">
//               <Alert color="warning" isOpen={this.state.alertVisible === ALERT_STATUS.ERROR} toggle={this.onDismissAlert}>
//                 Error: {error && error.graphQLErrors.length > 0 && error.graphQLErrors[0].message}
//               </Alert>
//               <Alert color="success" isOpen={this.state.alertVisible === ALERT_STATUS.SUCCESS} toggle={this.onDismissAlert}>
//                 {this.renderTopTitle()} successfully!
//               </Alert>
//               <div className="box box-primary">
//                 <div className="box-header">
//                   <div className="box-title">Role Capabilities</div>
//                 </div>
//                 <div className={[styles.boxBasicInfo, 'box-body'].join(' ')}>
//                   <Row>
//                     <Col sm={{ size: 6, offset: 3 }}>
//                       <FormGroup row>
//                         <Label for="name" sm={3}>Role Name</Label>
//                         <Col sm={9}>
//                           <Input
//                             type="text"
//                             id="name"
//                             placeholder="Username"
//                             value={this.state.roleName}
//                             onChange={(e) => this.setState({ roleName: e.target.value })}
//                           />
//                         </Col>
//                       </FormGroup>
//                       <FormGroup row>
//                         <Label sm={3}>Role Capabilities</Label>
//                         <Col sm={9}>
//                           <Row className={styles.rowSelectAll}>
//                             <Col sm={12}>
//                               <Label check>
//                                 <Input type="checkbox" checked={this.state.checkboxSelectAll} onClick={this.selectAllRoles} />
//                                 Select all
//                               </Label>
//                             </Col>
//                           </Row>
//                           <Row>
//                             {this.listRoles.map(this.renderRole)}
//                           </Row>
//                         </Col>
//                       </FormGroup>
//                     </Col>
//                   </Row>
//                 </div>
//                 <div className="box-footer">
//                   <Button color="primary" type="submit" className="float-right">Save</Button>
//                 </div>
//               </div>
//             </section>
//           </Form>
//         )}
//       </Mutation>
//     );
//   }
// }

// export default withApollo(AdminContentRolesFormComponent);