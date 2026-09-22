// withRouter.js
import { connect } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const WithRouter = (Component) => {
  return function Wrapper(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return (
      <Component
        {...props}
        user={props.user}
        location={location}
        navigate={navigate}
        params={params}
      />
    );
  };
};

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})


// export default connect(mapStateToProps)(WithRouter);
export default WithRouter;