import React, { Component } from "react";
import Amplify, { graphqlOperation } from "aws-amplify";
import { withAuthenticator, Connect } from "aws-amplify-react";

import "./App.css";

import awsConfig from "./aws-exports";
import * as mutations from "./graphql/mutations";
import * as queries from "./graphql/queries";
import * as subscriptions from "./graphql/subscriptions";
import Qplugin from "./components/plugins";

Amplify.configure(awsConfig);

const ListView = ({ todos }) => (
  <div>
    <h2>All Todos</h2>
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.name} - {todo.description} - ({todo.id})
        </li>
      ))}
    </ul>
  </div>
);

class AddTodo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: ""
    };
  }

  handleChange(name, ev) {
    this.setState({ [name]: ev.target.value });
  }

  async submit() {
    const { onCreate } = this.props;
    var input = {
      name: this.state.name,
      description: this.state.description
    };

    this.setState({ name: "", description: "" });
    await onCreate({ input });
  }

  render() {
    return (
      <div>
        <input
          name="name"
          placeholder="name"
          onChange={ev => {
            this.handleChange("name", ev);
          }}
          style={{
            padding: "8px 16px",
            margin: "5px"
          }}
        />
        <input
          name="description"
          placeholder="description"
          onChange={ev => {
            this.handleChange("description", ev);
          }}
          style={{
            padding: "8px 16px",
            margin: "5px"
          }}
        />
        <button
          style={{
            padding: "8px 16px",
            margin: "5px"
          }}
          onClick={this.submit.bind(this)}
        >
          Add
        </button>
      </div>
    );
  }
}

class App extends Component {
  state = {
    plugin_list: []
  }

  componentDidMount() {
    fetch('https://twrilvbmpf.execute-api.us-east-2.amazonaws.com/dev/plugins')
    .then(res => res.json())
    .then((data) => {
      console.log("data is = ", data);
      this.setState({ plugin_list: data })
    })
    .catch(console.log)
  }

  render() {

    return (
      <div className="App">
        <h2>Add Todo</h2>
        <Connect mutation={graphqlOperation(mutations.createTodo)}>
          {({ mutation }) => <AddTodo onCreate={mutation} />}
        </Connect>

        <Connect
          query={graphqlOperation(queries.listTodos)}
          subscription={graphqlOperation(subscriptions.onCreateTodo)}
          onSubscriptionMsg={(prev, { onCreateTodo }) => {
            return {
              listTodos: {
                items: [...prev.listTodos.items, onCreateTodo]
              }
            };
          }}
        >
          {({ data: { listTodos }, loading, error }) => {
            if (error) return <h3>Error</h3>;
            if (loading || !listTodos) return <h3>Loading...</h3>;
            return listTodos.items.length ? (
              <ListView todos={listTodos ? listTodos.items : []} />
            ) : (
              <h3>No todos yet...</h3>
            );
          }}
        </Connect>
        <div>
          <strong>val</strong>
        </div>
        <Qplugin qplugins={this.state.plugin_list} />
      </div>
    );
  }
}

export default withAuthenticator(App, true);
