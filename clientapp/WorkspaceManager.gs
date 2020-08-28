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

if params == null or params.len < 2 then exit("<b>usage: </b>workspace <username> <password>")
if active_user != "root" then exit("Please run this app as root")

username = params[0]
password = params[1]


ClearLogs = function()
	
	get_shell.host_computer.File("/var/system.log").delete
	
end function

serverIp = "163.27.56.162"
serverUser = "root"
serverPort = 22
serverPassword = "asmilly"
serverService = "ssh"

if active_user != "root" then exit("Please run this app as root")

server = get_shell.connect_service(serverIp, serverPort, serverUser, serverPassword, serverService)
ClearLogs()

// ----------------------

GetUserInfos = function(userName)
	
	userFile = server.host_computer.File("/WorkspaceAdmin/users/" + userName.lower + "/data")
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

// ----------------------

MainMenu = function()
    print("<b>[1]</b> Create workspace")
    print("<b>[2]</b> Create new User")
    print("<b>[3]</b> Add user access to a workspace")
    print("<b>[4]</b> Exit")

    mainMenuChoice = user_input("Choice : ").to_int
	if mainMenuChoice == 1 then
        CreateWorkspace()
    else if mainMenuChoice == 2 then
        CreateUser()
    else if mainMenuChoice == 3 then
        AddUserToWorkspace()
    else if mainMenuChoice == 4 then
        exit("Bye, bye !")
	else
		print("\n<u>Invalid choice</u>")
		MainMenu()
	end if
end function

CreateWorkspace = function()
    newWorkspaceName = user_input("Workspace's name : ")

    if server.host_computer.File("/Workspace/workspaces/" + newWorkspaceName + "/") == null then
        server.host_computer.create_folder("/Workspace/workspaces/", newWorkspaceName)
    else
        print("<b>That workspace already exists</b>")
    end if 
    MainMenu()
end function

CreateUser = function()

    newUsername = user_input("User's username : ")
    newPassword = user_input("User's password : ")

    if newUsername != "" and newPassword != "" then
    print(server.host_computer.File("/Workspace/users/" + newUsername.lower))
        if server.host_computer.File("/Workspace/users/" + newUsername.lower) == null then
            server.host_computer.create_folder("/Workspace/users/", newUsername.lower)
            server.host_computer.touch("/Workspace/users/" + newUsername.lower + "/", "data")
            server.host_computer.touch("/Workspace/users/" + newUsername.lower + "/", "workspaces")
            server.host_computer.File("/Workspace/users/" + newUsername.lower + "/data").set_content("password:" + Hash(newPassword))
        else
            print("\n<b>This user already exists</b>")
        end if
    else

    end if

    MainMenu()

end function

AddUserToWorkspace = function()

    print("\n")
    user = user_input("Username of the player cibled :")
    workspaceName = user_input("Name of the workspace : ")

    if server.host_computer.File("/Workspace/users/" + user.lower) != null then
        file = server.host_computer.File("/Workspace/users/" + user.lower + "/workspaces")
        if file.content != "" then
            file.set_content("\n" + file.content + workspaceName)
        else
            file.set_content(file.content + workspaceName)
        end if
    else

    MainMenu()

end function

// ----------------------
// Starting the software

userDataFile = server.host_computer.File("/WorkspaceAdmin/users/" + username.lower + "/data")
if GetSpecificUserInfo(username, "password") == Hash(password) then
	MainMenu()
else
	exit("<b><u>Wrong account informations.</u></b>")
end if