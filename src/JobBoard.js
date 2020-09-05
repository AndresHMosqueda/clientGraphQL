import React, { Component } from 'react';
import { JobList } from './JobList';
import { fetchPosts } from './requests';


export class JobBoard extends Component {

  constructor(props) {
    console.log(props);
    super(props);
    this.state = {jobs: []};
  }

  async componentDidMount(){
     const jobs = await fetchPosts();
     this.setState({jobs})
  }

  render() {
    const {jobs} = this.state;
    return (
      <div>
        <h1 className="title">Job Board</h1>
        <JobList jobs={jobs} />
      </div>
    );
  }
}
