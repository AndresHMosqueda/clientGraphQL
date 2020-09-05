const endPoint = 'http://localhost:9000/graphql';

export async function graphqlRequest(query, variables = {}) {
    const response = await fetch(endPoint, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            query,
            variables
        })
    })
    const responseBody = await response.json();
    if(responseBody.errors){
        const message = responseBody.errors.map((error) => error.message.join('\n'));
        throw new Error(message)
    }
    return responseBody.data
}

export async function loadCompany(id) {
    const query = `query($id: ID!){
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
    const {company} = await graphqlRequest(query, {id})
    return company;
}

export async function fetchPost(id) {
    const query = `
    query JobQuery($id: ID!){
        job(id: $id){
          id
          title
          company {
            id
            name
            description
          }
          description
        }
      }
    `;
    const {job} = await graphqlRequest(query, {id});
    return job
}

export async function fetchPosts() {
    const query = `
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
    const {jobs} = await graphqlRequest(query);
    return jobs
}