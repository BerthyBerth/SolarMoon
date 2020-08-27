// Things to do
// Check if there is special chars in register and block them
// Add an update function

Hash = function(value)
	amountBlocks = floor(value.len / 2)
	clockBlock = 0
	currentCharIndex = 1
	currentBlockValue = 0
	hashedValue = ""
	for i in value
		clockBlock = clockBlock + 1
		if clockBlock >= 3 then
			if (value % 2) != 0 and currentCharIndex == value.len then
				currentBlockValue = currentBlockValue + i.code
				hashedValue = hashedValue + str(currentBlockValue)
			else
				clockBlock = 1
				hashedValue = hashedValue + str(currentBlockValue)
				currentBlockValue = i.code
			end if
		else
			currentBlockValue = currentBlockValue + i.code
			if currentCharIndex == value.len then
				hashedValue = hashedValue + currentBlockValue
			end if
		end if
		currentCharIndex = currentCharIndex + 1
	end for
	return hashedValue
end function


ClearLogs = function()
	
	get_shell.host_computer.File("/var/system.log").delete
	
end function


serverIp = "43.76.173.223"
serverUser = "root"
serverPort = 22
serverPassword = "dersons"
serverService = "ssh"

if active_user != "root" then exit("Please run this app as root")

server = get_shell.connect_service(serverIp, serverPort, serverUser, serverPassword, serverService)
ClearLogs()

// -------------------------------------

StartApp = function()
	
	print("<b>[1]</b> Login")
	print("<b>[2]</b> Register")
	print("<b>[3]</b> Exit")
	
	answer = user_input("Choice : ")
	if answer == "1" then
		Login()
	else if answer == "2" then
		Register()
	else if answer == "3" then
		exit("<u>Thanks for using SolarMoon.</u>")
	else
		StartApp()
	end if
	
end function


Register = function()
	
	print("<b><u>\nRegister</u></b>")
	newUsername = user_input("Username : ", false)
	newPassword = user_input("Password : ", true)
	
	doesUsernameAlreadyExists = false
	
	for file in server.host_computer.File("/SolarMoon/users/").get_files
		if file.name.lower == newUsername.lower then doesUsernameAlreadyExists = true
	end for
	
	if doesUsernameAlreadyExists == false then
		userFile = server.host_computer.touch("/SolarMoon/users/", newUsername.lower)
		server.host_computer.File("/SolarMoon/users/" + newUsername.lower).set_content("password:" + Hash(newPassword) + "\nrank:user\nisblocked:false\nhasreadguidelines:false\ndownloads:0")
		// ClearLogs()
		MainMenu(newUsername)
	else
		print("This user already exists.")
		Register()
	end if
	
end function


Login = function()
	
	print("<b><u>\nLogin</u></b>")
	username = user_input("Username : ", false)
	password = user_input("Password : ", true)
	
	isPasswordValid = false
	
	userFile = server.host_computer.File("/SolarMoon/users/" + username.lower)
	if userFile != null then
		for userInfo in userFile.content.split("\n")
			lineSplitted = userInfo.split(":")
			if lineSplitted[0] == "password" then
				if lineSplitted[1] == Hash(password) then isPasswordValid = true
			end if
		end for
	else
		print("<u>Invalid username\n</u>")
		Login()
	end if
	
	if isPasswordValid == true then
		print("Login sucesfull")
	else
		print("<u>Password incorrect</u>")
		Login()
	end if
	
	MainMenu(username)
	
end function


// --------------------------
// User functions

// GetUserInfos return hashed password and number of downloads
GetUserInfos = function(userName)
	
	userFile = server.host_computer.File("/SolarMoon/users/" + userName.lower)
	if userFile == null then
		return null
	end if
	
	userInfos = userFile.content.split("\n") 
	return userInfos
	
end function

GetSpecificUserInfo = function(username, dataName)

    userInfos = GetUserInfos(username)
    for data in userInfos
        dataSplited = data.split(":")
        print(dataSplited[0])
        if dataSplited[0].lower == dataName.lower then
            return dataSplited[1]
        end if
    end for

    // Case if the data name given has not been found
    return null

end function

// --------------------------

MainMenu = function(username)
	
	print("\n<b><u>Solar Moon - " + username + "</u></b>")
    print("<b>[1]</b> Shop")
    print("<b>[2]</b> Library")
    print("<b>[3]</b> Manage Publications")
    print("<b>[4]</b> Exit")

    mainMenuChoice = user_input("Choice : ")

    if choice.to_int < 1 or choice.to_int > 4 then
        MainMenu(username)
    else
        if choice == "1" then
            Shop()
        else if choice == "2" then
            Library()
        else if choice == "3" then
            Publications()
        else if choice == "4" then
            exit("Thanks for using SolarMoon.")
        else
            MainMenu(username)
        end if
    end if
	
end function


// --------------------------


Shop = function(username)


end function


Library = function(username)


end function


ManagePublications = function(username)

	print("<b>[1]</b> Check stats")
	print("<b>[2]</b> Publish a new game")
	print("<b>[3]</b> Main Menu")

end function

StartApp()