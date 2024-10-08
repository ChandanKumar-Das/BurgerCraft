import { createContext, useState, useEffect } from 'react';
import { useNavigate , useLocation } from 'react-router-dom';
import { clear } from '../store/cartSclice';
import { useDispatch } from 'react-redux';

export const AppContext = createContext('');

const AppContextProvider = (props) => {
  const [allData, setallData] = useState([]);
//console.log(allData)
  // const [Data, setData] = useState(() => {
  //   const savedData = localStorage.getItem('burgerData');
  //   return savedData ? JSON.parse(savedData) : [];
  // });

  const [filterData, setFilterData] = useState([])
//console.log(filterData)
  const [user, setUser] = useState(() => {
    const savedData = localStorage.getItem('currentUser');
    return savedData ? JSON.parse(savedData) : null});

  const [errorMessage, setErrorMessage] = useState('');
  const [cartIsOpen, setCartIsOpen] = useState(false);
  
  const dispatch =useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Sign up function
  const signUp = (email,username, password) => {
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    const userExists = existingUsers.some(user => user.username === username);
    
    if (userExists) {
      setErrorMessage('User already exists!');
        return false;
    }
    
    // Add new user
    const newUser = { email,username, password };
    const currenUser = {email,username}
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    localStorage.setItem('currentUser', JSON.stringify(currenUser));
    setUser(newUser)
    navigate('/')
    return true;
};


const logIn = (username, password) => {
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = existingUsers.find(user => user.username === username && user.password === password);
    
    if (user) {
        setUser(user); 
        setErrorMessage('');
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/')
        return true;
    } else {
      setErrorMessage('Invalid credentials!');
        return false;
    }
};

const logOut = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    navigate('/')
    localStorage.removeItem('cartData')
    dispatch(clear())
};

useEffect(()=>{
  fetch('/data/AllBurger.json')
  .then((response) => response.json())
  .then((data) => {
    setallData(data)
  })
  .catch((error) => console.log(error));
},[])



  const handelSerch = (searchTerm) => {
    // console.log(searchTerm.toLowerCase())
            const filtered = allData.filter(burger =>
               burger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               burger.description.toLowerCase().includes(searchTerm.toLowerCase())
             );
             setFilterData(filtered);
             localStorage.setItem('burgerData', JSON.stringify(filtered));

             if(location.pathname === '/burger'){
              return 
             }else{
              navigate('/burger')
             }
            
             //console.log(Data)
        };



  const value = {
    allData,
    //handleFoodType,
    //Data,
    filterData,
    user, 
    signUp, 
    logIn, 
    logOut,
    errorMessage,
    handelSerch,
    setFilterData,
    cartIsOpen,
    setCartIsOpen,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
