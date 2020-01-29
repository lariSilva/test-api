const frisby = require("frisby");
const baseUrl = 'https://cat-fact.herokuapp.com';

describe("Tests in cat-fact API", () => {

  // sample of login and Authorization setup 
  beforeAll(() => {
    return frisby
      .post(`https://reqres.in/api/login`, {
        email: "eve.holt@reqres.in",
        password: "cityslicka"
      })
      .expect("status", 200)
      .then(response => {
        frisby.globalSetup({
          request: {
            headers: {
              Authorization: `Bearer ${response.json.token}`
            }
          }
        });
      });
  });

  it("GET fact by id 591f98803b90f7150a19c229, validate id and status", () => {
    const factId = '591f98803b90f7150a19c229';
    return frisby
      .get(`${baseUrl}/facts/${factId}`)
      .expect("status", 200)
      .expect("json", {
        _id: factId
      });
  });

  it("GET facts list, check validation of result limit and status", () => {
    return frisby
      .get(`${baseUrl}/facts/random?animal_type=cat&amount=10000`)
      .expect("status", 405)
      .expect("jsonTypes", {
        message: 'Limited to 500 facts at a time'
      });
  });

  it("GET facts list, validate result limit and status", () => {
    return frisby
      .get(`${baseUrl}/facts/random?animal_type=cat&amount=10`)
      .expect("status", 200)
      .then(function(res) {
        var body = res.body;
        expect(body.length === 10);
      })
  });

});
