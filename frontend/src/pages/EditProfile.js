export default function EditProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  function updateUser() {

  }

  return (
    <div>
      <h1>Edit your profile</h1>
      <form>
        <label>New username: </label>
        <br />
        <input type="text"
               placeholder={user.name}
        />
        <br />
        <label>Edit your description: </label>
        <br />
        <textarea placeholder={user.bio} rows="5">
        </textarea>
        <br />
        <button type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
