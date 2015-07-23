# nodebots-sg-2015
International Nodebots Day in Singapore (2015)


## BeagleBoneBlack (notes)

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
[root@PC ~]# xzcat Fedora-$TYPE-armhfp-22-3-sda.raw.xz | sudo dd of=$MEDIA; sync
# Takes ~20 mins (!)
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
[root@PC ~]# mkdir /tmp/root; mount $PART /tmp/root; ls /tmp/root 
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
[root@PC ~]# mkdir /tmp/root; mount $PART /tmp/root; ls /tmp/root 
ls /tmp/root/
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
Media *should* now be ready to boot on the BeagleBone.  Insert into the device and boot.  

To boot the Fedora 22 version of U-Boot on MicroSD you will need to hold the "User Boot" button (located near the MicroSD slot) when the device is powered on. 

*BUT* If you have no Serial cable... :: Need to do the following (from bottom of page)

*STILL UNDER DEVELOPMENT*
```
USER=myusername
rm /tmp/root/etc/systemd/system/graphical.target.wants/initial-setup-graphical.service
rm /tmp/root/etc/systemd/system/multi-user.target.wants/initial-setup-text.service
mkdir /tmp/root/root/.ssh/
cat /home/$USER/.ssh/id_rsa.pub >> /tmp/root/root/.ssh/authorized_keys
chmod -R u=rwX,o=,g= /tmp/root/root/.ssh/

umount /tmp/root
```
*STILL UNDER DEVELOPMENT*

Now, insert the MicroSD into the slot (gold teeth end up facing away from the board surface), and holding down the little switch on the front of the card (in the corner near the MicroSD slot), apply power.

Initially, the user lights will be off (

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


### Bonescript

bonescript seems like the js package installed :
* http://beagleboard.org/Support/BoneScript/demo_blinkled/  WORKS
* http://192.168.7.2/Support/bone101/ leads to 

```
Bonescript: initialized
name = BeagleBone Black
version = 00A5
serialNumber = 4134BBBK1100
bonescript = 0.2.4
```

### Board fundamentals

```
USER@PC $ ssh root@192.168.7.2 ::
root@beaglebone:/# df -h
Filesystem                                              Size  Used Avail Use% Mounted on
rootfs                                                  3.4G  1.4G  1.9G  42% /
udev                                                     10M     0   10M   0% /dev
tmpfs                                                   100M  608K   99M   1% /run
/dev/disk/by-uuid/5dc2a72d-c5f6-4efe-83bf-b20bc2176fc5  3.4G  1.4G  1.9G  42% /
tmpfs                                                   249M     0  249M   0% /dev/shm
tmpfs                                                   249M     0  249M   0% /sys/fs/cgroup
tmpfs                                                   100M     0  100M   0% /run/user
tmpfs                                                   5.0M     0  5.0M   0% /run/lock
/dev/mmcblk0p1                                           96M   72M   25M  75% /boot/uboot

root@beaglebone:/# more /proc/cpuinfo 
processor	: 0
model name	: ARMv7 Processor rev 2 (v7l)
BogoMIPS	: 298.24
Features	: swp half thumb fastmult vfp edsp thumbee neon vfpv3 tls 
CPU implementer	: 0x41
CPU architecture: 7
CPU variant	: 0x3
CPU part	: 0xc08
CPU revision	: 2

Hardware	: Generic AM33XX (Flattened Device Tree)
Revision	: 0000
Serial		: 0000000000000000

root@beaglebone:/# more /proc/meminfo 
MemTotal:         509024 kB
MemFree:          324208 kB
Buffers:           19952 kB
Cached:            67340 kB
SwapCached:            0 kB
Active:            92592 kB
Inactive:          65776 kB
Active(anon):      71472 kB
Inactive(anon):     1044 kB
Active(file):      21120 kB
Inactive(file):    64732 kB
Unevictable:           0 kB
Mlocked:               0 kB
HighTotal:             0 kB
HighFree:              0 kB
LowTotal:         509024 kB
LowFree:          324208 kB
SwapTotal:             0 kB
SwapFree:              0 kB
Dirty:                 0 kB
Writeback:             0 kB
AnonPages:         71068 kB
Mapped:            25016 kB
Shmem:              1444 kB
Slab:              15724 kB
SReclaimable:       9448 kB
SUnreclaim:         6276 kB
KernelStack:        1888 kB
PageTables:         1708 kB
NFS_Unstable:          0 kB
Bounce:                0 kB
WritebackTmp:          0 kB
CommitLimit:      254512 kB
Committed_AS:     799820 kB
VmallocTotal:     499712 kB
VmallocUsed:       31136 kB
VmallocChunk:     389116 kB

```
