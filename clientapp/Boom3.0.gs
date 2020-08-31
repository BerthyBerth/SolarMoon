if params.len != 1 then
    exit("<b><u>Please put an ip as argument.</u></b>")
end if

ip = params[0]

if ip.split(".").len == 3 then
    domainIp = nslookup(ip)
    if is_valid_ip(domainIp) == true then
        ip = domainIp
    end if
end if

ipRouter = get_router(ip)
ipPorts = ipRouter.used_ports

IpView = function()

    for port in ipPorts
        print(ipRouter.port_info(port))
    end for

end function