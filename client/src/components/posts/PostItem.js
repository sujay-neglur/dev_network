import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { deletePost, addLike, removeLike } from "../../actions/postActions";

class PostItem extends Component {
  onLikeClick = id => {
    this.props.addLike(id);
  };

  onUnlikeClick = id => {
    this.props.removeLike(id);
  };

  onDeleteClick = id => {
    this.props.deletePost(id);
  };

  findUserLike = likes => {
    const { auth } = this.props;
    return likes.filter(like => like.user === auth.user.id).length > 0;
  };

  render() {
    const { post, auth, showAction } = this.props;
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img
                className="rounded-circle d-none d-md-block"
                src={post.avatar}
                alt=""
              />
            </a>
            <br />
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            {showAction && (
              <span>
                <button
                  type="button"
                  className="btn btn-light mr-1"
                  onClick={() => this.onLikeClick(post._id)}
                >
                  <i
                    className={classnames("fas fa-thumbs-up", {
                      "text-info": this.findUserLike(post.likes)
                    })}
                  />
                  <span className="badge badge-light">{post.likes.length}</span>
                </button>
                <button
                  onClick={() => this.onUnlikeClick(post._id)}
                  type="button"
                  className="btn btn-light mr-1"
                >
                  <i className="text-secondary fas fa-thumbs-down" />
                </button>
                <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                  Comments
                </Link>
                {post.user === auth.user.id ? (
                  <button
                    className="btn btn-danger mr-1"
                    type="button"
                    onClick={() => this.onDeleteClick(post._id)}
                  >
                    <i className="fas fa-times" />
                  </button>
                ) : null}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired
};

PostItem.defaultProps = {
  showAction: true
};

export default connect(
  mapStateToProps,
  { deletePost, addLike, removeLike }
)(PostItem);
