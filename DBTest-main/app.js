document.getElementById('userForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('nameInput').value;
  const content = document.getElementById('contentInput').value;
  saveUser(name,content);
});

function saveUser(name,content) {
  fetch('/save', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        content:content
      })
  })
  .then(function(response){
    return response.text
  })
  .then(function(data){
    console.log(data);
    loadUsers();
  })
  .catch(function(error){
    console.error('Error',error);
  });
}

function loadUsers() {
  fetch('/load')
    .then(function(response){
      return response.json()
    })
    .then(data => {
      const userList = document.getElementById('userList');
      userList.innerHTML = '';
      data.forEach(user => {
        const userItem = document.createElement('div');
        const contentItem = document.createElement('div');
        userItem.textContent = user.name;
        // 클릭 이벤트 추가: 사용자 이름 클릭 시 해당 사용자의 페이지로 이동
        userItem.addEventListener('click', function() {
          window.location.href = `/user/${user.id}`; // 예시 URL, 사용자의 고유한 ID를 이용해 동적으로 URL 생성
        });
        userList.appendChild(userItem);
        contentItem.textContent = user.content;
        userList.appendChild(contentItem);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


// loadUsers();