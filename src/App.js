import React from 'react';
import { ModelRef } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import trainer from './helper/train';
import brain from 'brain.js';
import './App.scss';

const net = new brain.recurrent.LSTM();
let w = null;
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      query: '',
      result: '',
      progress: {}
    }
  }
  componentDidMount() {
    ModelRef.on('value', (snapshot) => {
      const data = snapshot.val();
      net.fromJSON(JSON.parse(data.model));
      toast.success("Base Model is Ready for use")
    })
  }
  infer = () => {
    const { query } = this.state;
    const result = net.run(query);
    this.setState({ result });
  }
  trainModelWithNewData = () => {
    const { data } = this.state;
    w = new Worker(trainer);
    w.postMessage(JSON.stringify({
      net,
      data,
    }));
    w.onmessage = (message) => {
      const data = JSON.parse(message.data);
      switch (data.type) {
        case 'PROGRESS':
          this.setState({ progress: data.stats })
          break;
        case 'RESULT':
          const { net } = data;
          ModelRef.set({
            model: JSON.stringify(net),
          }, () => {
            toast.success("Training is Completed")
          })
          break;
      }
    }
  }
  handleAddItem = () => {
    const { data } = this.state;
    data.push({});
    this.setState({ data });
  }
  handleSelectChange = (e) => {
    const el = e.target;
    const { data } = this.state;
    const index = parseInt(el.name);
    data[index].output = el.options[el.selectedIndex].value;
    this.setState({ data });
  }
  handleQueryChange = (e) => {
    this.setState({ query: e.target.value });
  }
  handleInputChange = (e) => {
    const { data } = this.state;
    const index = parseInt(e.target.name);
    data[index].input = e.target.value;
    this.setState({ data });
  }
  render() {
    const { data, result, query, progress } = this.state;
    return (
      <div className="App" >
        <h1>ML EXPLORER</h1>
        <div className="tab1">
          <div className="list">
            <button onClick={this.handleAddItem} className="addButton">Add an Item</button>
            {
              data.map((item, index) =>
                <div className="input-group">
                  <input name={index} placeholder="type your input" type="text" value={data[index].input} onChange={this.handleInputChange} />
                  <select name={index} onChange={this.handleSelectChange}>
                    <option>Select a Tag</option>
                    <option value="Happy">Happy</option>
                    <option value="Sad">Sad</option>
                    <option value="Cheerful">Cheerful</option>
                    <option value="Excited">Excited</option>
                    <option value="Neutral">Neutral</option>
                  </select>
                </div>
              )
            }
          </div>
          <div className="actions">
            {data.length > 0 && <button onClick={this.trainModelWithNewData}>TRAIN</button>}
            <div className="stats">{JSON.stringify(progress)}</div>
          </div>
        </div>
        <div className="tab2">
          <div className="content">
            <input type="text" onChange={this.handleQueryChange} value={query} placeholder="type your query here" />
            <button onClick={this.infer}>Query</button>
            <div className="result">
              <h3>{result}</h3>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>

    );
  }
}

export default App;
