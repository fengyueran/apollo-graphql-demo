

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { 
  graphql, Query, ApolloConsumer, Mutation
} from 'react-apollo';
import { LineContainer, VContainer, FlexContainer } from '@xinghunm/widgets';
import { 
  cardsListQuery, cardQuery, addCardMutation, deleteCardMutation
} from '../../models/local';

const cardStyles = {
  width: 200,
  height: 110,
  margin: 5,
  background: '#AFC9F1',
};

const Text = styled.span`
  margin: 5px 5px 5px 10px;
`;

const CaseName = styled.h3`
  margin: 10px;
`;

const Button = styled.button`
  outline: none;
  height: 39px;
  width: 85px;
  margin: 5px;
`;

const AddCard = () => (
  <Mutation mutation={addCardMutation}>
    {
      (addCard, { data }) => (
        <Button 
          onClick={() => {
            addCard({
              variables: { 
                i: {
                  caseName: "HT-18TEST",
                  name: 'test',
                  sex: 'male'
                }
              },
              refetchQueries: [{ query: cardsListQuery }], // 重新获取
            });
          }}
        >
          Add Card
        </Button>
      )
    }
  </Mutation>
);

const DeleteCard = () => (
  <Mutation 
    mutation={deleteCardMutation}
    update={(cache, { data: { deleteCard } }) => {
      let { cards } = cache.readQuery({ query: cardsListQuery });
      cards = cards.slice();
      cards.splice(0, 1);
      cache.writeQuery({ 
        query: cardsListQuery,
        data: { cards }
      });
    }}
  >
    {
      (deleteCard, { data }) => (
        <Button 
          onClick={() => {
            deleteCard({
              variables: { 
                caseName: "test"
              }
            });
          }}
        >
          Delete Card
        </Button>
      )
    }
  </Mutation> 
);

const Card = ({ caseName, name, sex }) => (
  <VContainer style={cardStyles}>
    <CaseName>
      {caseName}
    </CaseName>
    <Text>
      {`Name: ${name}`}
    </Text>
    <Text>
      {`Sex: ${sex}`}
    </Text>
  </VContainer>
);

Card.propTypes = {
  caseName: PropTypes.string.isRequired,
  sex: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const StartQuery = ({ onCardFetched }) => (
  <ApolloConsumer>
    {client => (
      <Button onClick={async () => {
        const { data } = await client.query({
          query: cardQuery,
          variables: { 
            name: "snow"
          },
        });
        onCardFetched(data);
      }}
      >
        Find Snow
      </Button>)
    }
  </ApolloConsumer>);

StartQuery.propTypes = {
  onCardFetched: PropTypes.func.isRequired
};
class App extends React.Component {
  state = {
    foundedCard: null
  }

  onCardFetched = (data) => {
    const { card } = data;
    this.setState({ foundedCard: card });
  }

  render() {
    const { foundedCard } = this.state;
    return (
      <Query 
        query={cardsListQuery}
        notifyOnNetworkStatusChange
        // pollInterval={500}// 每500ms query一次
      >
        {
          ({ 
            loading, error, data, startPolling, stopPolling, refetch,
            networkStatus 
          }) => {
            const cards = data && data.cards;
            if (networkStatus === 4) return 'Refetching'; // networkStatus1-8，详见networkStatushttps://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-networkStatus
            if (loading) {
              return <p>Loading</p>;
            }
            if (error) {
              return <p>{error.message}</p>;
            }

            return (
              <VContainer>
                <LineContainer>
                  <AddCard />
                  <DeleteCard />
                  <Button onClick={() => refetch()}>
                    Refetch
                  </Button>
                  <StartQuery onCardFetched={this.onCardFetched} />
                </LineContainer>
                <FlexContainer>
                  {
                    cards && cards.map(card => (
                      <Card key={card.id} {...card} />
                    ))
                  }
                </FlexContainer>
                {
                  foundedCard && (
                    <Text>
                      {`This is ${foundedCard.name}, Sex:${foundedCard.sex}, CaseName: ${foundedCard.caseName}` }
                    </Text>
                  )
                }
              </VContainer>
            );
          }
        }
      </Query>);
  }
}

export default App;