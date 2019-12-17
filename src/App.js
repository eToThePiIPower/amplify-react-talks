import React from 'react';

// imports from Amplify library
import { API, graphqlOperation } from 'aws-amplify'

// import query definition
import { listTalks as ListTalks } from './graphql/queries'

class App extends React.Component {
  // define some state to hold the data returned from the API
  state = {
    talks: []
  }

  // execute the query in componentDidMount
  async componentDidMount() {
    try {
      const talkData = await API.graphql(graphqlOperation(ListTalks))
      console.log('talkData:', talkData)
      this.setState({
        talks: talkData.data.listTalks.items
      })
    } catch (err) {
      console.log('error fetching talks...', err)
    }
  }
  render() {
    return (
      <>
        {
          this.state.talks.map((talk, index) => (
            <div key={index}>
              <h3>{talk.speakerName}</h3>
              <h5>{talk.name}</h5>
              <p>{talk.description}</p>
            </div>
          ))
        }
      </>
    )
  }
}

export default App
