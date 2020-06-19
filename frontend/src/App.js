import React from 'react';
import './App.css';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todoList: [],
            activeItem: {
                id: null,
                title: "",
                completed: false
            },
            editing: false
        }
        this.fetchTasks = this.fetchTasks.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.startEdit = this.startEdit.bind(this);
        this.getCookie = this.getCookie.bind(this);
    };

// Acquiring the csrf token
    getCookie(tokenSting) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, tokenSting.length + 1) === (tokenSting + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(tokenSting.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

    // life-cycle method
    componentWillMount() {
        this.fetchTasks();
    }

    // making an API call and rendering out the data
    fetchTasks() {
        console.log('fetching tasks...');
        fetch('http://127.0.0.1:8000/api/task-list/')
            .then(response => response.json())
            .then(data => this.setState({
                todoList: data
            }));
    }

    // handle the change in the input field by the user
    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        
        this.setState({
            activeItem: {
                ...this.state.activeItem,
                title: value
            }
        });
    }

    // will trigger and save data when user clicks submit button
    handleSubmit(event) {
        event.preventDefault(); //preventing the form from submitting and reloading the page
        let csrfToken = this.getCookie('csrftoken');
        let endpoint = `http://127.0.0.1:8000/api/task-create/`;
        if(this.state.editing === true) {
          endpoint = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`;
          this.setState({
            editing: false
          })
        }
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(this.state.activeItem)
        }).then(response => {
            this.fetchTasks();
            this.setState({
                activeItem: {
                  ...this.state.activeItem,
                id: null,
                title: "",
                completed: false
            }
            });
        }).catch(error => {
            console.error(`ERROR: ${error}`);
        });
    }
    // will set the editing flag to true
    startEdit(task) {
      this.setState({
        activeItem: task,
        editing: true
      })
    }

    // will handle the delete functionality
    deleteItem(task) {
      let csrfToken = this.getCookie('csrftoken');
      const endpoint = `http://127.0.0.1:8000/api/task-delete/${task.id}/`

      fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
           'X-CSRFToken': csrfToken
        }
      }).then(response => {
        this.fetchTasks();
      })
    }

    // will handle the completion of the tasks
    strikeUnstrike(task) {
      let selectedTask = {...task};
      selectedTask.completed = !selectedTask.completed;
      let csrfToken = this.getCookie('csrftoken');
      const endpoint = `http://127.0.0.1:8000/api/task-update/${task.id}/`

      fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(selectedTask)
        }).then(response => {
            this.fetchTasks();
        }).catch(error => {
            console.error(`ERROR: ${error}`);
        });
    
    }

    render() {
        let tasks = this.state.todoList;
        let self = this;
        return (
            <div className='container'>
        <div id='task-container'>
            <h1 className='app-title'>✔Check List</h1>
          <div id='form-wrapper'>
            <form   onSubmit={this.handleSubmit} id="form">
                    <div className='flex-wrapper'>
                        <div style={{flex: 6}}>
                            <input  onChange={this.handleChange} className='form-control' id='title' type='text' value={this.state.activeItem.title} name='title' placeholder='Add task..' />
                         </div>

                         <div style={{flex: 1}}>
                            <input id='submit' className='btn btn-warning' type='submit' name='Add' />
                          </div>
                      </div>
                </form>
          </div>

          <div className='list-wrapper'>
            {
              tasks.map(function (task, index) {
                return(
                    <div key={index} className='task-wrapper flex-wrapper'>
                      <div onClick={() => self.strikeUnstrike(task)} style={{flex: 7}}>
                      {task.completed === false ? (<span>{task.title}</span>) : (<strike>{task.title}</strike>)}
                      </div>
                      <div style={{flex: 1}}>
                        <button onClick={() => self.startEdit(task)} className='btn btn-sm btn-outline-info'>Edit</button>
                      </div>
                      <div style={{flex: 1}}>
                        <button onClick={() => self.deleteItem(task)} className='btn btn-sm btn-outline-dark delete'>X</button>
                      </div>
                    </div>
                  );
              })
            }
          </div>
          
        </div>
        
      </div>
        )
    }
}

export default App;