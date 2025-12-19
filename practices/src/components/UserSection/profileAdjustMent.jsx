const profileAdjustMent = ({ object, setObject, ...props }) => {
  function handleProfilesChanges(key) {
    setObject((prev) => {
      const newState = {};
      Object.keys(prev).forEach((k) => {
        newState[k] = false;
      });
      newState[key] = true;
      return newState;
    });
  }
  return (
    <div className="flex gap-5 w-full justify-center">
      {Object.keys(object).map((key, index) => (
        <span
          key={index}
          {...props}
          style={{
            backgroundColor: object[key] ? "#003A78FF" : "",
            color: object[key] ? "white" : "",
          }}
          onClick={() => handleProfilesChanges(key)}
        >
          {key}
        </span>
      ))}
    </div>
  );
};

export default profileAdjustMent;
