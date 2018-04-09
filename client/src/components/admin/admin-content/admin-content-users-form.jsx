import React from 'react';
import FontAwesome from '@fortawesome/react-fontawesome';
import { Row, Col, Collapse, Button, Form as BootstrapForm, Alert } from 'reactstrap';
import { Form } from 'react-form';
import { compose, withHandlers } from 'recompose';

import { requiredValidation, passwordMatchValidation, emailValidation } from '../../../utils/validation';
import { ALERT_STATUS } from '../../../commons/enum';
import Breadcrumb from '../../../shared/breadcrumb';
import { ContentContainer, ContentHeader, ContentBody } from '../../../shared/contentContainer';
import { BoxWrapper, BoxBody, BoxFooter } from '../../../shared/boxWrapper';
import { BootstrapTextField, BootstrapSelectField } from '../../../shared/formFields';

const AdminContentUsersFormComponent = ({
  submitForm,
  alertVisible,
  removeAlert,
  alertContent,
  renderTopTitle,
  breadcrumbItems,
  isEditedUser,
  getRoles: { roles = [] },
  toggleAdditionalForm,
  additionalInformationVisible,
  roleMapper
}) => (
  <ContentContainer>
    <Form onSubmit={submitForm} getApi={this.getFormApi}>
      {formApi => (
        <BootstrapForm onSubmit={formApi.submitForm}>
          <ContentHeader>
            <h1>{renderTopTitle()}</h1>
            <Breadcrumb items={breadcrumbItems} />
          </ContentHeader>
          <ContentBody>
            <Alert color={alertVisible} isOpen={alertVisible !== ALERT_STATUS.HIDDEN} toggle={removeAlert}>
              {alertContent}
            </Alert>
            <BoxWrapper color="primary" title="Basic Information">
              <BoxBody>
                <Row>
                  <Col lg={6} md={12}>
                    <BootstrapTextField
                      field="username"
                      label="Username"
                      type="text"
                      validate={requiredValidation}
                      disabled={isEditedUser}
                    />
                    <BootstrapTextField
                      field="password"
                      label="Password"
                      type="password"
                      validate={requiredValidation}
                    />
                    <BootstrapTextField
                      field="retype_password"
                      label="Retype Password"
                      type="password"
                      validate={value => passwordMatchValidation(value, formApi.values.password)}
                    />
                    <BootstrapTextField
                      field="email"
                      label="Email"
                      type="text"
                      validate={emailValidation}
                    />
                    <BootstrapSelectField
                      field="role"
                      label="Role"
                      data={[
                        { value: '', text: '-- Please Select --'},
                        ...roles.map(roleMapper)
                      ]}
                      validate={requiredValidation}
                    />
                  </Col>
                  <Col lg={6} md={12}>
                    <div className="box box-success box-solid">
                      <div className="box-header with-border">
                        <h3 className="box-title"> Additional Information </h3>
                        <div className="box-tools float-right">
                          <button
                            type="button"
                            className="btn btn-box-tool"
                            onClick={toggleAdditionalForm}>
                            <FontAwesome icon={additionalInformationVisible ? 'minus' : 'plus'} />
                          </button>
                        </div>
                      </div>
                      <div className="box-body">
                        <Collapse isOpen={additionalInformationVisible}>
                          <BootstrapTextField
                            field="fullname"
                            label="Full Name"
                            type="text"
                          />
                          <BootstrapTextField
                            field="address"
                            label="Address"
                            type="text"
                          />
                          <BootstrapTextField
                            field="phone"
                            label="Phone"
                            type="text"
                          />
                        </Collapse>
                      </div>
                    </div>
                  </Col>
                </Row>
              </BoxBody>
              <BoxFooter>
                <Button color="primary" type="submit" className="float-right">Save</Button>
              </BoxFooter>
            </BoxWrapper>
          </ContentBody>
        </BootstrapForm>
      )}
    </Form>
  </ContentContainer>
);

export default compose(
  withHandlers({
    roleMapper: () => item => ({
      text: item.name,
      value: item.id
    })
  })
)(AdminContentUsersFormComponent);

// class AdminContentUsersFormComponent extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       additionalInformationVisible: false,
//       alertVisible: ALERT_STATUS.HIDDEN,
//       formApi: null
//     };
//   }

//   static propTypes = {
//     isEditedUser: PropTypes.bool
//   };

//   static defaultProps = {
//     isEditedUser: false
//   };

//   renderTopTitle = () => (this.props.isEditedUser ? 'Edit User' : 'Add New User');

//   toggleAdditionalForm = () => this.setState({ additionalInformationVisible: !this.state.additionalInformationVisible });

//   getFormApi = async formApi => {
//     const { isEditedUser, client, match, history } = this.props;
//     if (isEditedUser) {
//       try {
//         const { data } = await client.query({
//           query: GET_USER_BY_ID,
//           variables: { id: match.params.id }
//         });

//         const user = _.cloneDeep(data.user);
//         user.role = user.role.id;

//         formApi.setAllValues(user);
//       }
//       catch (e) {
//         history.push('/admin/user');
//       }
//     }
//     this.setState({ formApi });
//   }

//   onDismissAlert = () => this.setState({ alertVisible: ALERT_STATUS.HIDDEN });

//   triggerErrorCallback = () => this.setState({ alertVisible: ALERT_STATUS.ERROR });

//   triggerSuccessCallback = () => {
//     this.state.formApi.resetAll();
//     this.setState({ alertVisible: ALERT_STATUS.SUCCESS });
//   }

//   renderRoleSelect = item => (
//     <option key={item.id} value={item.id}>
//       {item.name}
//     </option>
//   );

//   roleMapper = item => ({
//     text: item.name,
//     value: item.id
//   });

//   submitForm = (data, userMutation) => {
//     data.password = sha1(data.password);
//     userMutation({
//       variables: data
//     });
//   };

//   updateUserCache = (cache, { data }) => {
//     try {
//       const { users } = cache.readQuery({ query: GET_FULL_USERS });
      
//       if (this.props.isEditedUser) {
//         const index = users.findIndex(item => item.id === data.editUser.id);
//         users[index] = data.editUser;
//       }
//       else {
//         users.push(data.createUser);
//       }
      
//       cache.writeQuery({ query: GET_FULL_USERS, data: { users } });
//     }
//     catch (e) {
//       // Do nothing
//     }
//   }

//   render() {
//     const { isEditedUser } = this.props;
//     return (
//       <Mutation
//         mutation={CREATE_USER}
//         onError={this.triggerErrorCallback}
//         onCompleted={this.triggerSuccessCallback}
//         update={this.updateUserCache}
//       >
//         {(userMutation, { error }) => (
//           <Form onSubmit={data => this.submitForm(data, userMutation)} getApi={this.getFormApi}>
//           {formApi => (
//             <BootstrapForm onSubmit={formApi.submitForm}>
//               <section className="content-header">
//                 <h1> {this.renderTopTitle()} </h1>
//                 <Breadcrumb>
//                   <BreadcrumbItem>
//                     <Link to="/admin"><FontAwesome icon="home" /> Home</Link>
//                   </BreadcrumbItem>
//                   <BreadcrumbItem>
//                     <Link to="/admin/user"><FontAwesome icon="user" /> Users</Link>
//                   </BreadcrumbItem>
//                   <BreadcrumbItem active> {this.renderTopTitle()} </BreadcrumbItem>
//                 </Breadcrumb>
//               </section>
//               <section className="content">
//                 <Alert color="warning" isOpen={this.state.alertVisible === ALERT_STATUS.ERROR} toggle={this.onDismissAlert}>
//                   Error: {error && error.graphQLErrors.length > 0 && error.graphQLErrors[0].message}
//                 </Alert>
//                 <Alert color="success" isOpen={this.state.alertVisible === ALERT_STATUS.SUCCESS} toggle={this.onDismissAlert}>
//                   {this.renderTopTitle()} successfully!
//                 </Alert>
//                 <div className="box box-primary">
//                   <div className="box-header">
//                     <div className="box-title">Basic Information</div>
//                   </div>
//                   <div className={[styles.boxBasicInfo, 'box-body'].join(' ')}>
//                     <Row>
//                       <Col lg={6} md={12}>
//                         <BootstrapTextField
//                           field="username"
//                           label="Username"
//                           type="text"
//                           validate={requiredValidation}
//                           disabled={isEditedUser}
//                         />
//                         <BootstrapTextField
//                           field="password"
//                           label="Password"
//                           type="password"
//                           validate={requiredValidation}
//                         />
//                         <BootstrapTextField
//                           field="retype_password"
//                           label="Retype Password"
//                           type="password"
//                           validate={value => passwordMatchValidation(value, formApi.values.password)}
//                         />
//                         <BootstrapTextField
//                           field="email"
//                           label="Email"
//                           type="text"
//                           validate={emailValidation}
//                         />
//                         <Query query={GET_ROLES(['id', 'name'])}>
//                           {({ data, loading }) => {
//                             if (loading) return 'Loading...';
//                             const dataRoles = [
//                               { value: '', text: '-- Please Select --'},
//                               ...data.roles.map(this.roleMapper)
//                             ];
//                             return (
//                               <BootstrapSelectField
//                                 field="role"
//                                 label="Role"
//                                 data={dataRoles}
//                                 validate={requiredValidation}
//                               />
//                             );
//                           }}
//                         </Query>
//                       </Col>
//                       <Col lg={6} md={12}>
//                         <div className="box box-success box-solid">
//                           <div className="box-header with-border">
//                             <h3 className="box-title"> Additional Information </h3>
//                             <div className="box-tools float-right">
//                               <button
//                                 type="button"
//                                 className="btn btn-box-tool"
//                                 onClick={this.toggleAdditionalForm}>
//                                 <FontAwesome icon={this.state.additionalInformationVisible ? 'minus' : 'plus'} />
//                               </button>
//                             </div>
//                           </div>
//                           <div className="box-body">
//                             <Collapse isOpen={this.state.additionalInformationVisible}>
//                               <BootstrapTextField
//                                 field="fullname"
//                                 label="Full Name"
//                                 type="text"
//                               />
//                               <BootstrapTextField
//                                 field="address"
//                                 label="Address"
//                                 type="text"
//                               />
//                               <BootstrapTextField
//                                 field="phone"
//                                 label="Phone"
//                                 type="text"
//                               />
//                             </Collapse>
//                           </div>
//                         </div>
//                       </Col>
//                     </Row>
//                   </div>
//                   <div className="box-footer">
//                     <Button color="primary" type="submit" className="float-right">Save</Button>
//                   </div>
//                 </div>
//               </section>
//             </BootstrapForm>
//           )}
//         </Form>
//         )}
//       </Mutation>
//     );
//   }
// }

// export default withApollo(withFormApi(AdminContentUsersFormComponent));