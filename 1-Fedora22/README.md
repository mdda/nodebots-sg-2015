### Installing Fedora 22

Need MicroSD for : (https://fedoraproject.org/wiki/Architectures/ARM/F22/Installation#For_the_BeagleBone_.28_Black_.26_White_.29)

Found a spare MicroSD card that has a readable (and ready to be deleted) partition at ```/dev/sdh1```.

Download spin (XFCE is my spin-of-choice) from : 
* http://download.fedoraproject.org/pub/fedora/linux/releases/22/Images/armhfp/


```
wget http://ftp.yz.yamagata-u.ac.jp/pub/linux/fedora/linux/releases/22/Images/armhfp/Fedora-Xfce-armhfp-22-3-sda.raw.xz
# Takes ~15mins

# write the image to the media
[root@PC ~]# TYPE=Xfce
[root@PC ~]# MEDIA=/dev/sdg
[root@PC ~]# xzcat Fedora-$TYPE-armhfp-22-3-sda.raw.xz | dd of=$MEDIA; sync
# Takes ~18 mins (!)
9265152+0 records in
9265152+0 records out
4743757824 bytes (4.7 GB) copied, 1057.85 s, 4.5 MB/s

# After writing the image, read the new partition table and mount the root partition 
[root@PC ~]# partprobe $MEDIA
[root@PC ~]# parted $MEDIA
GNU Parted 3.2
Using /dev/sdg
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) print
Model: Mass Storage Device (scsi)
Disk /dev/sdg: 15.9GB
Sector size (logical/physical): 512B/512B
Partition Table: msdos
Disk Flags: 

Number  Start   End     Size    Type     File system     Flags
 1      1049kB  513MB   512MB   primary  ext3
 2      513MB   1025MB  512MB   primary  linux-swap(v1)
 3      1025MB  4525MB  3500MB  primary  ext4

(parted) quit                                             

[root@PC ~]# PART=/dev/sdg1
[root@PC ~]# mkdir -p /tmp/root; mount $PART /tmp/root; ls /tmp/root 
boot.cmd                                                 initrd-plymouth.img
boot.cmd.old                                             klist.txt
boot.scr                                                 lost+found/
boot.scr.old                                             System.map-4.0.4-301.fc22.armv7hl
config-4.0.4-301.fc22.armv7hl                            uImage
dtb-4.0.4-301.fc22.armv7hl/                              uImage-4.0.4-301.fc22.armv7hl
extlinux/                                                uInitrd
grub/                                                    uInitrd-4.0.4-301.fc22.armv7hl
grub2/                                                   vmlinuz-0-rescue-f3a963abba20421abf5157c972af9415
initramfs-0-rescue-f3a963abba20421abf5157c972af9415.img  vmlinuz-4.0.4-301.fc22.armv7hl
initramfs-4.0.4-301.fc22.armv7hl.img                     .vmlinuz-4.0.4-301.fc22.armv7hl.hmac
# This is the wrong one...  we want to mount the '/' of the SD card on /tmp/root
[root@PC ~]# umount /tmp/root

[root@PC ~]# PART=/dev/sdg3
[root@PC ~]# mkdir /tmp/root
[root@PC ~]# mount $PART /tmp/root
[root@PC ~]# ls /tmp/root 
bin  boot  dev  etc  home  lib  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
## This is the right answer...

## now to write the correct U-Boot for the Hardware :
# For the BeagleBone ( Black & White ) 

[root@PC ~]# dd if=/tmp/root/usr/share/uboot/beaglebone/MLO of=$MEDIA count=1 seek=1 conv=notrunc bs=128k
0+1 records in
0+1 records out
81292 bytes (81 kB) copied, 0.00631184 s, 12.9 MB/s

[root@PC ~]# dd if=/tmp/root/usr/share/uboot/beaglebone/u-boot.img of=$MEDIA count=2 seek=1 conv=notrunc bs=384k
1+1 records in
1+1 records out
406492 bytes (406 kB) copied, 0.0211522 s, 19.2 MB/s
```
*If* you have a screen and/or a serial console interface, the media should now be ready to boot on the BeagleBone.  

But, if (like me), you're only connected by USB, you need to tell ```systemd``` not to wait for the screen prompts to be answered  (this is from the bottom of the Fedora instructions) :

```
[root@PC ~]# USER=myusername
rm -f /tmp/root/etc/systemd/system/graphical.target.wants/initial-setup-graphical.service
rm -f /tmp/root/etc/systemd/system/multi-user.target.wants/initial-setup-text.service
mkdir /tmp/root/root/.ssh/
cat /home/$USER/.ssh/id_rsa.pub >> /tmp/root/root/.ssh/authorized_keys
chmod -R u=rwX,o=,g= /tmp/root/root/.ssh/
```

During the first boot (coming soon) the system will launch the 'initial-setup' utility. For graphical images this will occur on the display, for minimal images this will occur on the serial console.  Failure to complete the initial-setup will prevent logging into the system.  

To log in to the root account without completing the initial-setup you will need to minimally edit ```/etc/passwd``` file and remove the 'x' from the line beginning with 'root' (this will allow you to log into the root account without entering a password). 

```
[root@PC ~]# nano /tmp/root/etc/passwd
```

### Getting Ethernet over USB on Fedora

* http://askubuntu.com/questions/380810/internet-over-usb-on-beaglebone-black
* http://shallowsky.com/blog/hardware/flashing-beaglebone-black.html
* http://shallowsky.com/blog/hardware/talking-to-beaglebone.html
* http://blog.nixpanic.net/2011/03/configuring-beagleboard-to-have-network.html

HUGE problem identified on (http://unix.stackexchange.com/questions/180547/connecting-linux-device-to-a-tablet-via-usb) :
```
[root@beaglebone ~]# cat /boot/config-$(uname -r) | grep  CONFIG_USB_ETH
# CONFIG_USB_ETH is not set
```

So, next stop :
* http://dumb-looks-free.blogspot.sg/2014/05/beaglebone-black-bbb-cross-compile_28.html

Even if ```g_ether.ko``` were available, we'd still need to do the bridging stuff that many posts focus on...

Ah, BUT (having seen [configfs](https://wiki.tizen.org/wiki/USB/Linux_USB_Layers/Configfs_Composite_Gadget/General_configuration)) ::
```
[root@localhost network-scripts]# cat /boot/config-$(uname -r) | grep CONFIGFS_FS
CONFIG_CONFIGFS_FS=y
```
So, perhaps there is a possibility of making this work!  : 

* https://wiki.tizen.org/wiki/USB/Linux_USB_Layers/Configfs_Composite_Gadget/Usage_eq._to_g_ether.ko
* http://www.spinics.net/lists/linux-usb/msg76388.html


```
```



### Static IP over Ethernet

The default NetworkManager settings are for the Fedora installation to want to start networking with DHCP.  If it is connected to your PC via USB, this isn't so convenient (unless you set up a network bridge to your existing DHCP provider, or set up dnsmasq locally, for instance).  So, instead, provide a static route in ```/tmp/root/``` :



```
[root@PC ~]# cat > /tmp/root/etc/sysconfig/network-scripts/ifcfg-Static_.7.2 <<EOF
NAME="Static .7.2"
TYPE=Ethernet
DEVICE=usb0
BOOTPROTO=none
IPADDR0=192.168.7.2
PREFIX0=24
GATEWAY0=192.168.7.1
DNS1=192.168.7.1
DEFROUTE=yes
ONBOOT=yes
UUID=e4d2eac2-aec6-4725-afb4-c508d84344bf
IPV4_FAILURE_FATAL=no

#IPV6INIT=yes
#IPV6_AUTOCONF=yes
#IPV6_DEFROUTE=yes
#IPV6_FAILURE_FATAL=no
#IPV6_PEERDNS=yes
#IPV6_PEERROUTES=yes
EOF
```

(side note, on the BeagleBoneBlack, when booted in its default distribution 'Angstrom', the MicroSD card is mounted automatically, and the networking file is in : ```/media/__/etc/sysconfig/network-scripts/```, where it can be edited/overwritten without having to take out the MicroSD and switch machines, etc).

Also, to avoid endless frustrations, switch off ```SELINUX``` (can be renabled later, once everything is humming along): 
```
[root@PC ~]# nano /tmp/root/etc/selinux/config
# Change 'enforcing' to 'disabled'
```

Finally, (with fingers crossed that the above steps worked...) :

```
[root@PC ~]# umount /tmp/root
```

#### Insert into the device and boot.  

With the power off, insert the MicroSD into the slot (gold teeth end up facing away from the board surface), and holding down the little switch on the front of the card (in the corner near the MicroSD slot), apply power, then release the little switch.

Initially, the user lights will be off, but after 30-45secs, user2 will start to some some flickering.  Not clear what that indicates yet...

#### Post-boot installations

```
hostname beaglebone
dnf install -y joe
```

#### Copying Fedora U-Boot to eMMC on the Beaglebone Black

To Copy the Fedora U-Boot to the eMMC on the Beaglebone Black execute the following steps:
*STILL UNDER DEVELOPMENT*

```
# mount emmc boot partition 
mkdir /tmp/emmc; mount /dev/mmcblk1p1 /tmp/emmc

# optionally back up original U-Boot
mkdir /tmp/emmc/orig-uboot; cp /tmp/emmc/{MLO,u-boot.img} /tmp/emmc/orig-uboot/

# copy Fedora U-Boot
cp /usr/share/uboot/beaglebone/{MLO,u-boot.img} /tmp/emmc/
```

Once completed you will no longer need to press the "User Boot" button to select the Fedora U-Boot. 



