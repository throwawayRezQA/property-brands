# property-brands

The repository for the cypress tests related to the property hub.

## getting started

Before you can start, ensure that [yarn](https://yarnpkg.com/en/) was installed:
$ npm i -g yarn

To run cypress, you need to have the proper dependencies installed. To do so:
$ apt update

$ apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

In case of running cypress on WSL2, you also need to follow those steps:
1. Install VcXsrv Windows X Server
2. Open .bashrc (or equivalent such as .zshrc) and set the DISPLAY environment variable by adding the following:
export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}'):0.0
sudo /etc/init.d/dbus start &> /dev/null
3. Close .bashrc. Now linux user needs to be granted access to dbus without a password. Execute the following command:
$ sudo visudo -f /etc/sudoers.d/dbus
4. In the editor that launches, add the following line with your username:
<your_username> ALL = (root) NOPASSWD: /etc/init.d/dbus
5. Make sure the Windows firewall is opened for VcxSrv - the firewall prompt should be displayed after the first `cypress open` command run
6. Run XLaunch and select the following:
- Multiple windows [NEXT]
- Start no client [NEXT]
- Tick 'Disable access control', leave other options ticked [NEXT]
- [FINISH]

## running cypress

To open cypress in debug mode:
$ npx cypress open

To run all cypress scripts:
$ npx cypress run

To run specific suite:
$ npx cypress run --spec path-to-spec
