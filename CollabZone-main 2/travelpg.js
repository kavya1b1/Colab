// Mock Data
let individuals = [
    { name: 'Alice', from: 'New York', to: 'Los Angeles', date: '2024-12-01', time: '09:00 AM', rules: 'No smoking' },
    { name: 'Bob', from: 'Chicago', to: 'San Francisco', date: '2024-12-05', time: '10:00 AM', rules: 'Punctuality required' },
    { name: 'Charlie', from: 'Houston', to: 'Miami', date: '2024-12-03', time: '02:00 PM', rules: 'Share fuel costs' }
  ];
  
  let teams = [
    { teamName: 'West Coast Explorers', from: 'Seattle', to: 'San Diego', date: '2024-12-10', time: '11:00 AM', rules: 'Share navigation duties', members: ['Eve', 'Frank'] }
  ];
  
  let myTeams = [];
  
  // Utility Functions
  function displayResults(listId, results, type) {
    const list = document.getElementById(listId);
    list.innerHTML = '';
  
    if (results.length === 0) {
      list.innerHTML = `<li>No ${type} found</li>`;
    } else {
      results.forEach((result, index) => {
        const listItem = document.createElement('li');
        if (type === 'individual') {
          listItem.innerHTML = `
            ${result.name} - From: ${result.from}, To: ${result.to}, Date: ${result.date}, Time: ${result.time}
            <button onclick="removeIndividual(${index})">Remove</button>
          `;
        } else if (type === 'team') {
          listItem.innerHTML = `
            ${result.teamName} - Members: ${result.members.join(', ')}
            <button onclick="removeTeam(${index})">Remove</button>
          `;
        }
        list.appendChild(listItem);
      });
    }
  }
  
  // Search Individuals
  function searchIndividuals() {
    const input = document.getElementById('search-individual-input').value.toLowerCase();
    const results = individuals.filter(
      i => i.name.toLowerCase().includes(input) || i.from.toLowerCase().includes(input) || i.to.toLowerCase().includes(input)
    );
    displayResults('individual-results-list', results, 'individual');
  }
  
  // Search Teams
  function searchTeams() {
    const input = document.getElementById('search-team-input').value.toLowerCase();
    const results = teams.filter(
      t => t.teamName.toLowerCase().includes(input) || t.from.toLowerCase().includes(input) || t.to.toLowerCase().includes(input)
    );
    displayResults('team-results-list', results, 'team');
  }
  
  // Remove Individual
  function removeIndividual(index) {
    individuals.splice(index, 1);
    searchIndividuals();
  }
  
  // Remove Team
  function removeTeam(index) {
    teams.splice(index, 1);
    displayResults('team-results-list', teams, 'team');
  }
  
  // Add Team Member
  function addTeamMember() {
    const membersDiv = document.getElementById('team-members');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter member name';
    input.classList.add('team-member-input');
    membersDiv.appendChild(input);
  }
  
  // Create Team
  document.getElementById('team-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const teamName = document.getElementById('team-name').value;
    const from = document.getElementById('team-from').value;
    const to = document.getElementById('team-to').value;
    const date = document.getElementById('team-date').value;
    const time = document.getElementById('team-time').value;
    const rules = document.getElementById('team-rules').value;
    const members = Array.from(document.querySelectorAll('.team-member-input')).map(input => input.value);
  
    const newTeam = { teamName, from, to, date, time, rules, members };
    myTeams.push(newTeam);
    displayResults('my-teams-list', myTeams, 'team');
    this.reset();
  });
  