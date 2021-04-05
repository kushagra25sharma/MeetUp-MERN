import "./Login.css";
import { Button } from "@material-ui/core";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";
import { GoogleLogin } from "react-google-login";


const Login = () => {
    const [{}, dispatch] = useStateValue();

    // const signIn = () => {
    //     dispatch({
    //         type: actionTypes.SET_USER,
    //         user: "Chimtu",
    //     });
    // };

    const googleSuccess = (res) => {
        const result = res?.profileObj;
        // console.log(result);
        console.log(result?.givenName);
        try {
            dispatch({ 
                type: actionTypes.SET_USER,
                user: result,
            });
      
          } catch (error) {
            console.log(error);
          }
    }

    const googleError = () => alert('Google Sign In was unsuccessful. Try again later');
    
    return (
        <div className="signin" >
            <div className="signin__container" >
                <img src="https://whatsappbrand.com/wp-content/themes/whatsapp-brc/images/WhatsApp_Logo_1.png" alt="whatsapp logo" />
                <div className="signin__text" >
                    <h1>Sign in to whatsapp</h1>
                </div>
                <GoogleLogin
                  clientId="407551877909-iqectq5mla3tsf4m69cqn3stm1rj8mbo.apps.googleusercontent.com"
                  render={(renderProps) => (
                    <Button onClick={renderProps.onClick} disabled={renderProps.disabled} >Sign in with Google</Button>
                  )}
                  onSuccess={googleSuccess}
                  onFailure={googleError}
                  cookiePolicy="single_host_origin"
                 />
            </div>
        </div>
    );
}

export default Login;

// 407551877909-iqectq5mla3tsf4m69cqn3stm1rj8mbo.apps.googleusercontent.com

// _kU5FDJX2H-PpQF2c9nKqWTL