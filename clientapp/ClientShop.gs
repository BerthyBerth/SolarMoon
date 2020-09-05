if active_user != "root" then exit("<color=red><b><u>Please run this software as root.</u></b></color>")

// --------------------------------
// Pre-Defined variables (to change with the informations of raven)

username = "fenyco / berth"
password = "420"

// --------------------------------

style = {}

style.error = function(text)

    text = "<color=red><b><u>" + text + "</u></b></color>"
    return text

end function

style.title = function(text)

    text = "<size=19><b><u>" + text + "</u></b></size>"
    return text

end function

// --------------------------------

MainMenu = function(message)

    clear_screen()

    if message != null then
        print(message)
    end if

    print(style.title("Shop"))

    print("[1] Shop")
    print("[2] Library")
    print("[3] Exit")

    choice = user_input("Choice : ").to_int

    if typeof(choice) == "number" then
        if choice == 1 then
            ShopMenu()
        else if choice == 2 then
            Library()
        else
            exit("<size=19><b><u>Thanks for using *********** !</u></b></size>")
        end if
    else
        MainMenu(style.error("Invalid choice."))
    end if

end function

// --------------------------------

ShopMenu = function(message)

    clear_screen()

    if message != null then
        print(message)
    end if

    print(style.title("Shop"))
    print("[1] Shop")
    print("[2] Publications")
    print("[3] Back")

    choice = user_input("Choice : ").to_int

    if typeof(choice) != "number" then
        if choice == 1 then
            ShopPublic()
        else if choice == 2 then
            UserPublications()
        else
            MainMenu()
        end if
    else

    end if

end function

ShopCateg = function()

    print(style.title("Shop"))
    print("[1] Officials")
    print("[2] Verified")
    print("[3] Unverified")

    choice = user_input("Choice : ").to_int

    

end function

// --------------------------------

Library = function()



end function

// --------------------------------

MainMenu()