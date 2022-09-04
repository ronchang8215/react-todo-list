import './App.css';
import React from 'react';
import { useForm } from "react-hook-form";
import {
    HashRouter,
    NavLink,
    Link,
    Route,
    Routes,
    useNavigate,
    useParams,
    Outlet
  } from 'react-router-dom';
import axios from 'axios';
import { clear } from '@testing-library/user-event/dist/clear';

// let token = '';

function TodoListPage() {
    const { useState, useEffect } = React;
    const [todo,setTodo] = useState('')
    const [todos,setTodos] = useState([])
    const [pageStatus,setPageStatus] = useState("all")
    useEffect(() => {
      getTodos()
    },[])
    const logOut = () => {
      // e.preventDefault();
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
      axios.delete(`https://todoo.5xcamp.us/users/sign_out`)
      .then(res => {
        localStorage.removeItem('token');
        console.log(localStorage.getItem('token'))
        console.log(res.data)
        alert(res.data.message)
        window.location.reload()
      })
      .catch(error => {
        console.error(JSON.stringify(error.response.data));
      });  
    }
    const getTodos = () => {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
      axios.get('https://todoo.5xcamp.us/todos')
      .then(res => {
        console.log(localStorage.getItem('token'))
        console.log(res.data)
        setTodos(res.data.todos)
      })
      .catch(error => {
        console.error(JSON.stringify(error.response.data));
      });  
    }
    const add = (e) => {
      e.preventDefault();
      if (todo.trim() == "") return;
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
      axios.post('https://todoo.5xcamp.us/todos', {todo:{
        content:todo
      }})
      .then(res => {
        console.log(localStorage.getItem('token'))
        console.log(res.data)
        // alert(`回傳結果：${JSON.stringify(res.data)}`);
        getTodos()
      })
      .catch(error => {
        console.error(JSON.stringify(error.response.data));
      });
      // setTodos([{
      //   id:new Date().getTime(),
      //   content: todo,
      //   completed: false
      //   },...todos]);
      console.log(todos)
    }
    const remove = (e,id) => {
      e.preventDefault();
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
      axios.delete(`https://todoo.5xcamp.us/todos/${id}`)
      .then(res => {
        console.log(localStorage.getItem('token'))
        console.log(res.data)
        getTodos()
      })
      .catch(error => {
        console.error(JSON.stringify(error.response.data));
      });  
      // setTodos(todos.filter(item => item !== c))
    }
    const toggle = (id) =>{
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
      axios.patch(`https://todoo.5xcamp.us/todos/${id}/toggle`)
      .then(res => {
        console.log(localStorage.getItem('token'))
        console.log(res.data)
        getTodos()
      })
      .catch(error => {
        console.error(JSON.stringify(error.response.data));
      }); 
      // c.completed = !c.completed;
      // setTodos([...todos])
    }
    const clear = (e) => {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
      todos.forEach(item =>{
        if (!item.completed_at) {
          return
        }
        remove(e,item.id)
      })
    }
    return (  
      <div className="bg-half">
          <nav>
            <h1><Link to="/todos">ONLINE TODO LIST</Link></h1>
            <ul>
              <li className="todo_sm"><Link to="/todos"><span>王小明的代辦</span></Link></li>
              <li><Link to="/" onClick={() =>logOut()}>登出</Link></li>
            </ul>  
          </nav>
          <div className="conatiner todoListPage vhContainer">
              <div className="todoList_Content">
                  <div className="inputBox">
                      <input type="text" placeholder="請輸入待辦事項" onChange={(e)=> setTodo(e.target.value)} />
                      <a href="#" onClick={(e)=> add(e)}>
                          <i className="fa fa-plus"></i>
                      </a>
                  </div>
                { todos.length >0 ? 
                  <div className="todoList_list">
                      <ul className="todoList_tab">
                          <li><a href="javascript:void(0)" className={pageStatus === 'all' ? 'active':''} onClick={() => setPageStatus('all')}>全部</a></li>
                          <li><a href="javascript:void(0)" className={pageStatus === 'undone' ? 'active':''} onClick={() => setPageStatus('undone')}>待完成</a></li>
                          <li><a href="javascript:void(0)" className={pageStatus === 'completed' ? 'active':''} onClick={() => setPageStatus('completed')}>已完成</a></li>
                      </ul>
                      <div className="todoList_items">
                        {pageStatus === 'all'&& 
                          <ul className="todoList_item">
                            {todos.map(item => {
                              return (
                              <li key={item.id}>
                                  <label className="todoList_label">
                                      <input className="todoList_input" type="checkbox" value="true" defaultChecked={item.completed_at} onClick={()=>toggle(item.id)}/>
                                      <span>{item.content}</span>
                                  </label>
                                  <a href="#" style={{ marginBottom:"1rem" }} onClick={(e) => remove(e,item.id)}>
                                      <i className="fa fa-times"></i>
                                  </a>
                              </li>)
                            })}
                          </ul>}
                        {pageStatus === 'undone'&& 
                          <ul className="todoList_item">
                            {todos.map(item => {
                              return !item.completed_at &&
                              <li key={item.id}>
                                  <label className="todoList_label">
                                      <input className="todoList_input" type="checkbox" value="true" defaultChecked={item.completed_at} onClick={()=>toggle(item.id)}/>
                                      <span>{item.content}</span>
                                  </label>
                                  <a href="#" style={{ marginBottom:"1rem" }} onClick={(e) => remove(e,item.id)}>
                                      <i className="fa fa-times"></i>
                                  </a>
                              </li>
                            })}
                          </ul>}
                          {pageStatus === 'completed'&& 
                          <ul className="todoList_item">
                            {todos.map(item => {
                              return item.completed_at &&
                              <li key={item.id}>
                                  <label className="todoList_label">
                                      <input className="todoList_input" type="checkbox" value="true" defaultChecked={item.completed_at} onClick={()=>toggle(item.id)}/>
                                      <span>{item.content}</span>
                                  </label>
                                  <a href="#" style={{ marginBottom:"1rem" }} onClick={(e) => remove(e,item.id)}>
                                      <i className="fa fa-times"></i>
                                  </a>
                              </li>
                            })}
                          </ul>
                          }
                          <div className="todoList_statistics">
                              <p> {todos.filter(item => !item.completed_at ).length}個待完成項目</p>
                              <a href="javascript:void(0)" onClick={(e) => clear(e)}>清除已完成項目</a>
                          </div>
                      </div>
                  </div>
                 :  <p style={{textAlign:'center'}}>目前尚無代辦內容</p> }
              </div>
          </div>
      </div>
  )}

function Login() {  
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onBlur"
    });
    const login = (data) => {
    axios.post('https://todoo.5xcamp.us/users/sign_in', {user:data})
        .then(res => {
        console.log(res.data)
        alert(JSON.stringify(res.data.message));
        localStorage.setItem('token', res.headers.authorization);
        // token = res.headers.authorization
        // console.log(localStorage.getItem('token'))
        navigate('/todos')
        })
        .catch(error => {
        alert(JSON.stringify(error.response.data.message));
        });
    }
    return (
    <div id="loginPage" className="bg-yellow">
        <div className="conatiner loginPage vhContainer ">
            <div className="side">
                <a href="#"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></a>
                <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
            </div>
            <div>
                <form className="formControls" onSubmit={handleSubmit(login)}>
                    <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
                    <label className="formControls_label" htmlFor="email">Email</label>
                    <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required {...register("email", { required: true , pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g })} />
                    {errors.email && errors.email.type === "required" && <span>此欄位不可留空</span>}
                    {errors.email && errors.email.type === "pattern" && <span>不符合 Email 規則</span> }
                    <label className="formControls_label" htmlFor="pwd">密碼</label>
                    <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required {...register("password", { required: { value: true, message: "此欄位必填" }, minLength: {value: 6, message:  "密碼至少為 6 碼"}})} />
                    <span>{errors.password?.message}</span>
                    <input className="formControls_btnSubmit" type="submit" value="登入" />
                    <Link className="formControls_btnLink" to="/signup">註冊帳號</Link>
                </form>
            </div>
        </div>
    </div>
    )
}

function SignUp() {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: "onBlur"
    });
    const signUp = (data) => {
        { /* 練習區 */ }
        axios.post('https://todoo.5xcamp.us/users', {user:data})
            .then(res => {
            console.log(res.data)
            alert(JSON.stringify(res.data.message))
            navigate('/')
            // alert(`回傳結果：${JSON.stringify(res.data)}`);
            })
            .catch(error => {
            alert(JSON.stringify(error.response.data.message)+JSON.stringify(error.response.data.error[0]));
            });
    }
    return (
    <div id="signUpPage" className="bg-yellow">
        <div className="conatiner signUpPage vhContainer">
            <div className="side">
                <a href="#"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></a>
                <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
            </div>
            <div>
                <form className="formControls" onSubmit={handleSubmit(signUp)}>
                    <h2 className="formControls_txt">註冊帳號</h2>
                    <label className="formControls_label" htmlFor="email">Email</label>
                    <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required {...register("email", { required: true , pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g })} />
                    {errors.email && errors.email.type === "required" && <span>此欄位不可留空</span>}
                    {errors.email && errors.email.type === "pattern" && <span>不符合 Email 規則</span> }
                    <label className="formControls_label" htmlFor="name">您的暱稱</label>
                    <input className="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱" required {...register("nickname", { required: { value: true, message: "此欄位必填" }})}/>
                    <span>{errors.nickname?.message}</span>
                    <label className="formControls_label" htmlFor="pwd">密碼</label>
                    <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required {...register("password", { required: { value: true, message: "此欄位必填" }, minLength: {value: 6, message:  "密碼至少為 6 碼"}})} />
                    <span>{errors.password?.message}</span>
                    <label className="formControls_label" htmlFor="pwd">再次輸入密碼</label>
                    <input className="formControls_input" type="password" name="pwd2" id="pwd2" placeholder="請再次輸入密碼" required {...register("pwd2", { 
                            required: {value : true, message: "此欄位不可留空"}, 
                            validate: (value) => {
                            if (watch('password') !== value) {
                              return "兩次密碼輸入不同";
                            }
                          } })} />
                    <span>{errors.pwd2?.message}</span>
                    <input className="formControls_btnSubmit" type="submit" value="註冊帳號" />
                    <Link className="formControls_btnLink" to="/">登入</Link>
                </form>
            </div>
        </div>
    </div>
    )
}

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onBlur"
  });
  return ( 
  <>
  <HashRouter>
    {/** login_page**/ }
    {/* <Login /> */}
    {/** sign up**/ }
    {/* <SignUp /> */}
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/todos" element={<TodoListPage />} />
    </Routes>
  </HashRouter>
</>
  );
}

export default App;
