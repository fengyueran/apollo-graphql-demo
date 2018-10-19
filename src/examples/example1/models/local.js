import gql from 'graphql-tag';

const cardsListQuery = gql`
  query CardsListQuery {
    cards { # 返回cards数组，数组每个元素包含id，caseName, name和sex
      id
      caseName
      name
      sex
    }
  }
`;

const addCardMutation = gql`
  mutation addCard($i: CreateCardInput!) {
    addCard(i: $i) {
      caseName
      name
      sex
    }
  }
`;

const deleteCardMutation = gql`
  mutation deleteCard($id: String!) {
    deleteCard(id: $id) {
      caseName #只返回caseName
    }
  }
`;

export { cardsListQuery, addCardMutation, deleteCardMutation };
