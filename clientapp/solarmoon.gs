// Things to do
// Check if there is special chars in register and block them
// Add an update function

// Note that every data in the database is stocked as string

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

StartApp = function(message)

	clear_screen()
	if message != null then print(message + "\n")
	
	print("<size=19><u><b>SolarMoon</b></u></size>\n")
	print("<b>[1]</b> Login")
	print("<b>[2]</b> Register")
	print("<b>[3]</b> Exit")
	
	answer = user_input("> ")
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


Register = function(message)
	
	clear_screen()
	if message != null then print(message + "\n")

	print("<size=19><b><u>\nRegister</u></b></size>\n")
	newUsername = user_input("Username : ", false)
	newPassword = user_input("Password : ", true)
	
	doesUsernameAlreadyExists = false
	
	for file in server.host_computer.File("/SolarMoon/users/").get_files
		if file.name.lower == newUsername.lower then doesUsernameAlreadyExists = true
	end for
	
	if doesUsernameAlreadyExists == false then
		userFile = server.host_computer.create_folder("/SolarMoon/users/", newUsername.lower)
		userFile = server.host_computer.touch("/SolarMoon/users/" + newUsername.lower + "/", "infos")
		server.host_computer.File("/SolarMoon/users/" + newUsername.lower + "/infos").set_content("password:" + Hash(newPassword) + "\nrank:user\nisbanned:false\nhasreadguidelines:false\ndownloads:0")
		// ClearLogs()
		globals.username = newUsername
		MainMenu()
	else
		print("This user already exists.")
		StartApp()
	end if
	
end function


Login = function(message)
	
	clear_screen()
	if message != null then print(message + "\n")

	print("<size=19><b><u>Login</u></b></size>\n")
	username = user_input("Username : ", false)
	password = user_input("Password : ", true)
	
	isPasswordValid = false
	
	userPassword = GetSpecificUserInfo(username, "password")

	if userPassword != null then
		if userPassword == Hash(password) then
			print("\n<b><u>Login Successful</u></b>")
			wait(2)
			globals.username = username
			MainMenu()
		else
			Login()
		end if
	else
		print(userPassword)
		StartApp("<u>Invalid username</u>")
	end if
	
end function


// --------------------------
// User functions

// GetUserInfos return hashed password and number of downloads
GetUserInfos = function(username)
	
	userFile = server.host_computer.File("/SolarMoon/users/" + username.lower + "/infos")
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
        if dataSplited[0].lower == dataName.lower then
            return dataSplited[1]
        end if
    end for

    // Case if the data name given has not been found
    return null

end function

SetSpecificUserInfo = function(username, dataName, newData)

	if GetUserInfos(username) == null then return null

	infosSplitted = GetUserInfos(username)

	for i in range(0, infosSplitted.len - 1)
		infoRowSplitted = infosSplitted[i].split(":")
		currentDataName = infoRowSplitted[0]

		if currentDataName == dataName then
			infosSplitted[i] = infosSplitted[i].split(":")
			infosSplitted[i][1] = newData

			infosSplitted[i] = infosSplitted[i].join(":")

			infosSplitted = infosSplitted.join("\n")

			userFile = server.host_computer.File("/SolarMoon/users/" + username.lower + "/infos")
			if userFile != null then
				userFile.set_content(infosSplitted)
			end if
		end if
	end for

end function

// --------------------------

MainMenu = function()
	
	clear_screen()

	print("<size=19><b><u>Solar Moon - " + username + "</u></b></size>\n")
    print("<b>[1]</b> Shop")
    print("<b>[2]</b> Library")
    print("<b>[3]</b> Manage Publications")
    print("<b>[4]</b> Exit")

    mainMenuChoice = user_input("> ")

    if mainMenuChoice.to_int < 1 or mainMenuChoice.to_int > 4 then
        MainMenu()
    else
        if mainMenuChoice == "1" then
            ShopMenu()
        else if mainMenuChoice == "2" then
            Library()
        else if mainMenuChoice == "3" then
            ManagePublications()
        else if mainMenuChoice == "4" then
			clear_screen()
            exit("<b><u>Thanks for using SolarMoon.</u></b>")
        else
            MainMenu()
        end if
    end if
	
end function


// --------------------------


ShopMenu = function()

	clear_screen()

	print("<size=19><b><u>Shop Menu</u></b></size>\n")

	print("<b>[1]</b> Official")
	print("<b>[2]</b> Verified")
	print("<b>[3]</b> Not-Verified")
	print("<b>[4]</b> Main Menu")

	choice = user_input("> ")

	if choice == "1" then
		ShopOfficial()
	else if choice == "2" then
		ShopVerified()
	else if choice == "3" then
		ShopNotVerified()
	else if choice == "4" then
		MainMenu()
	else 
		ShopMenu()
	end if


end function

ShopOfficial = function()

	clear_screen()

	SetSpecificUserInfo(user_input("User > "), user_input("Data Name > "), user_input("Data Value > "))

end function

ShopVerified = function()



end function

ShopNotVerified = function()



end function

// --------------------------

Library = function()



end function

// --------------------------

ManagePublications = function(username)

	clear_screen()

	print("<size=19><b><u>Managing Publications</u></b></size>\n")

	print("<b>[1]</b> Check stats")
	print("<b>[2]</b> Publish a new game")
	print("<b>[3]</b> Main Menu")

end function

// --------------------------

StartApp()