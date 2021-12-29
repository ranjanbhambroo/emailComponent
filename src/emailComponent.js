import React, { useEffect, useState } from "react";

const EmailComponent = () => {
  const [emails, setEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(0);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [emailList, setEmailList] = useState([]);

  // function to remove emails from the array when the user clicks the X icon
  const removeEmails = (indexOfEmailToRemove) => {
    setEmails([...emails.filter((_, idx) => idx !== indexOfEmailToRemove)]);
  };

  // function to add emails
  const addEmails = (event) => {
    if (event.target.value !== "") {
      setEmails([...emails, event.target.value]);
      //props.selectedEmails([...emails, event.target.value]);
      event.target.value = "";
    }
  };

  // Handle enter key and tab key press to add emails
  // using preventDefault to prevent the default action of the tab key
  const handleAddEmails = (event) => {
    if (event.key === "Enter") {
      addEmails(event);
    } else if (event.key === "Tab") {
      event.preventDefault();
      addEmails(event);
    }
  };

  // get email list from db.json
  const getEmailList = () => {
    fetch("./db.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then((response) => {
        //console.log(response.json().emails);
        return response.json();
      })
      .then((myJson) => {
        setEmailList(myJson);
      });
  };

  useEffect(() => {
    getEmailList();
  }, []);

  // function to suggest emails on change event
  const suggestEmails = (event) => {
    const input = event.currentTarget.value;
    const newFilteredSuggestions = emailList.filter(
      (emailSuggestion) =>
        emailSuggestion.toLowerCase().indexOf(input.toLowerCase()) > -1
    );
    setActiveEmail(0);
    setFilteredEmails(newFilteredSuggestions);
  };

  // On click event in the suggestion dropdown to add email
  const onClickAddEmail = (event) => {
    setActiveEmail(0);
    setFilteredEmails([]);
    setEmails([...emails, event.target.innerText]);
    console.log(event.target);
  };

  // Function to test if the email is valid email
  const isValidEmail = (email) => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    return true;
  };

  // Drop down component to show email suggestions
  const EmailSuggestionDropDown = () => {
    console.log(filteredEmails);
    if (filteredEmails.length) {
      return (
        <ul className="emailDropDown">
          {filteredEmails.map((filteredEmail, index) => {
            let className;
            if (index === activeEmail) {
              className = "active";
            }
            return (
              <li
                className={className}
                key={filteredEmail}
                onClick={onClickAddEmail}
              >
                {filteredEmail}
              </li>
            );
          })}
        </ul>
      );
    }
    return <></>;
  };

  return (
    <>
      <div className="emails">
        <ul id="emailTags">
          {emails.map((email, index) => (
            <li
              key={index}
              className={isValidEmail(email) ? "email" : "email-error"}
            >
              <span className="email-content">{email}</span>
              <span className="remove-icon" onClick={() => removeEmails(index)}>
                x
              </span>
            </li>
          ))}
        </ul>
        <input
          type="text"
          onChange={suggestEmails}
          onKeyDown={handleAddEmails}
          placeholder={emails.length === 0 ? 'Enter recipients' : ''}
        />
      </div>
      <EmailSuggestionDropDown />
    </>
  );
};
export default EmailComponent;
