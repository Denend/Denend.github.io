import {gql} from 'apollo-boost';

const signUpUs = gql`
  mutation($email:String,$familyName:String, $name:String!, $password:String!){
    CreateUser(
      email:$email,
      familyName:$familyName,
      name:$name,
      password:$password
    ){
      uuid
    }
  }
`

const submitCCodeMutation = gql`
  mutation($email:String,$confirmationCode:String){
    ConfirmUserRegistration(
      email:$email,
      confirmationCode:$confirmationCode
    )
}
`
const loginUs = gql`
  mutation($email:String,$password:String){
    loginUser(
      email:$email,
      password:$password
    ){
      accessToken
      idToken
    }
  }
`
const addReceiptMutation = gql`

    mutation($date:Date!,$description:String,$imageUrl:String!,$item_name:String!,$cost:Int!) {
      createReceipt(
        date:$date,
        description:$description,
        imageUrl: $imageUrl,
        itemName: $item_name,
        price: $cost,

      ){
        uuid
      }
    }
`
const showAllReceipts = gql`
  {
    ListCurrentUserReceipts{
      date
      description
      imageUrl
      itemName
      price
      uuid
    }
  }
`


export {signUpUs,loginUs,addReceiptMutation,submitCCodeMutation,showAllReceipts};
