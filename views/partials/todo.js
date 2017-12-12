function initializeApp() {
      console.log(hide_done);
      $.get('/todoList',
        {
          'task': $('input[name=task]').val(),
          'hide_done': $('#hide_done').is(':checked'),
          'order': $('input[name=order]:checked').val()
        },
        function callback(data, status) {
          //when the thing comes back, update the DOM. 
          if (status != 'success') {
            console.log(status);
          } else {
            // var result = data.result;
            // console.log("todo list data came back");
            var result = data.result;
            //update DOM.

            $('#list').html("");

            $.each(result, function(i, item) {
              var checkIt = 'unchecked';
              var is_done = 'alert alert-danger';

              if (result[i].is_done) {
                is_done = 'alert alert-success';
                checkIt = 'checked';
              }

              var taskID = result[i].id;
              var taskName = result[i].task;

              var input_id = result[i].id + result[i].task;
              var reg = new RegExp("[ ]+","g");
              input_id = input_id.replace(reg,"");

              //console.log(input_id);
              //$('#list').append('<input class="' +is_done+ '" type="radio" name="taskList" value="' +result[i].id+ '">' +result[i].task+ '</input><br/>');
              $('#list').append('<div class="' +is_done+ ' col-lg-6 alert alert-success">' +
                                '<div class="input-group">' +
                                '<span class="input-group-addon my-label">' +
                                '<input type="checkbox" class="bigger" aria-label="Checkbox for following text input" onchange="setDone(this, ' +taskID+ ');" ' +checkIt+ '>' +
                                '</span>' +
                                '<input type="text" id="' +input_id+ '" class="' +is_done+ ' task_input form-control" aria-label="Text input with checkbox" value="' +taskName+ '"' +
                                  'onchange="updateTask(' +taskID+ ', \'#' +input_id+ '\')">' +
                                '<button type="button" class="close x-button" onclick="deleteTask(' +taskID+ ')" aria-label="Close"><span aria-hidden="true" class="x-button">&times;</span></button>' +
                                '</div></div>');
              //console.log(result[i].id);
              //console.log(result[i].task);
                console.log(input_id);
              $('#forNotDone').attr('class', is_done);
              //console.log(is_done);
            });
          }
        });
    }

    function handleLogin() {
      var username = $("#username").val();
	    var password = $("#password").val();
      
      var params = {
		    username: username,
		    password: password
	    };
    }

    function createTask() {
      if ($('#taskName').val() == '') {
        alert("Enter a task");
      } else {
        $.post('/createTask',
        {
          'task': $('input[name=task]').val(),
          //'taskList': $('input[name=taskList]:checked').val()
        },
        function callback(data, status) {
          //when the thing comes back, update the DOM. 
          if (status != 'success') {
            console.log(status);
          } else {
            //console.log("create task data came back");
            var result = data.result;
            //update DOM.
            initializeApp();
            $('#taskName').val("");
          }
        });
      }
    }

    function setDone(checkbox, id) {
      var is_done = false;
      if (checkbox.checked == true) {
        is_done = true;
      }

      //console.log(is_done);

      $.ajax({
        url: '/setDone',
        type: 'PUT',
        data: {
          'id': id,
          'is_done': is_done
        },
        json: true,
        success: function callback(data, status) { 
          if (status != 'success') {
            console.log(status);
          } else {
            initializeApp();
          }
        }});
    }

    function updateTask(id, input_id) {
      var taskList = $('input[name=taskList]:checked').val();
      var taskName = $(input_id).val();

      //console.log(data.taskList);
      console.log(taskName);
      console.log(id);

      $.ajax({
        url: '/updateTask',
        type: 'PUT',
        data: {
          'taskName': taskName,
          //'taskList': taskList,
          'id': id
        },
        json: true,
        success: function callback(data, status) { 
          if (status != 'success') {
            console.log(status);
          } else {
            //console.log("data came back");
            var result = data.result;
            //update DOM.
            initializeApp();
            $('#taskName').val("");
          }
      }});
    }

    function deleteTask(id) {
      var taskList = $('input[name=taskList]:checked').val();

      //console.log(taskList);

      $.ajax({
        url: '/deleteTask',
        type: 'DELETE',
        data: {
          'id': id,
          //'taskList': taskList
        },
        json: true,
        success: function callback(data, status) { 
          if (status != 'success') {
            console.log(status);
          } else {
            //console.log("data came back");
            var result = data.result;
            //update DOM.
            initializeApp();
          }
      }});
    }