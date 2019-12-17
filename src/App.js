import React from 'react';

// imports from Amplify library
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react'

// import query definition
import { listTalks as ListTalks } from './graphql/queries'
import { createTalk as CreateTalk } from './graphql/mutations'

// import uuid to create a unique client ID
import uuid from 'uuid/v4'

const CLIENT_ID = uuid()

class App extends React.Component {
  // define some state to hold the data returned from the API
  state = {
    name: '', description: '', speakerName: '', speakerBio: '',
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
    try {
      const user = await Auth.currentAuthenticatedUser()
      console.log('user:', user)
      console.log('user info:', user.signInUserSession.idToken.payload)
    } catch (err) {
      console.log('error fetching user info...', err)
    }
  }
  createTalk = async() => {
    const { name, description, speakerBio, speakerName } = this.state
    if (name === '' || description === '' || speakerBio === '' || speakerName === '') return

    const talk = { name, description, speakerBio, speakerName, clientId: CLIENT_ID }
    const talks = [...this.state.talks, talk]
    this.setState({
      name: '', description: '', speakerName: '', speakerBio: '', talks
    })

    try {
      await API.graphql(graphqlOperation(CreateTalk, { input: talk }))
      console.log('item created!')
    } catch (err) {
      console.log('error creating talk...', err)
    }
  }
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  render() {
    return (
      <>
        <input
          name='name'
          onChange={this.onChange}
          value={this.state.name}
          placeholder='name'
        />
        <input
          name='description'
          onChange={this.onChange}
          value={this.state.description}
          placeholder='description'
        />
        <input
          name='speakerName'
          onChange={this.onChange}
          value={this.state.speakerName}
          placeholder='speakerName'
        />
        <input
          name='speakerBio'
          onChange={this.onChange}
          value={this.state.speakerBio}
          placeholder='speakerBio'
        />
        <button onClick={this.createTalk}>Create Talk</button>
        {
          this.state.talks.map((talk, index) => (
            <div key={index}>
              <h3>{talk.speakerName}</h3>
              <h5>{talk.name}</h5>
              <p>{talk.description}</p>
              <ul>
              {talk.comments.items.map((comment, index) => (
                <li>
                  <b>{comment.createdBy}</b>
                  <p>{comment.message}</p>
                  <hr/>
                </li>
              ))}
              </ul>
            </div>
          ))
        }
      </>
    )
  }
}

export default withAuthenticator(App, { includeGreetings: true })
