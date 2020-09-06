import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from 'apollo-boost';
import gql from 'graphql-tag';
import { isLoggedIn, getAccessToken } from './auth';

const endPoint = 'http://localhost:9000/graphql';

const authLink = new ApolloLink((operation, forward) => {
    if(isLoggedIn()){
        operation.setContext({
            headers: {
                'authorization':'Bearer ' + getAccessToken()
            }
        })
    }
    return forward(operation);
})

const client = new ApolloClient({
    link: ApolloLink.from([ 
        authLink,
        new HttpLink({uri: endPoint})
    ]),
    cache: new InMemoryCache()
})

const jobQuery = gql`
    query JobQuery($id: ID!){
        job(id: $id){
          id
          title
          company {
            id
            name
          }
          description
        }
      }
    `;

export async function createJob(input) {
    const mutation = gql`
    mutation CreateJob($input: CreateJobInput){
        job: createJob(input: $input) {
          id
          title
          company {
            id
            name
          }
            description
        }
      }`;
    const {data: {job}} = await client.mutate({
        mutation,
        variables: {input},
        update: (cache, {data}) => {
            cache.writeQuery({
                query: jobQuery,
                variables: {id: data.job.id},
                data
        })
     }
    });
    return job
}

export async function loadCompany(id) {
    const query = gql`
    query($id: ID!){
        company(id: $id){
         id
         description
         name
         jobs {
            description
            id
            title
         }
        }
      }`;
      const {data: {company}} = await client.query({query, variables: {id}});
    return company;
}

export async function fetchPost(id) { 
    const {data: {job}} = await client.query({query: jobQuery, variables: {id}});
    return job
}

export async function fetchPosts() {
    const query = gql`
    {
      jobs {
          id
          title
          description
          company {
            id
            name
            description
          }
          description
        }
      }`;
      const {data: {jobs}} = await client.query({query, fetchPolicy: 'no-cache'});
        return jobs
}