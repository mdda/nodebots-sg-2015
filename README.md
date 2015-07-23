# nodebots-sg-2015
International Nodebots Day in Singapore (2015)


## BeagleBoneBlack (notes)

### Installing Fedora 22

Need MicroSD for : (https://fedoraproject.org/wiki/Architectures/ARM/F22/Installation#For_the_BeagleBone_.28_Black_.26_White_.29)

Found a spare MicroSD card :: 
/dev/sdh1

Download spin (XFCE is my spin-of-choice) from : 
* http://download.fedoraproject.org/pub/fedora/linux/releases/22/Images/armhfp/


```
wget http://ftp.yz.yamagata-u.ac.jp/pub/linux/fedora/linux/releases/22/Images/armhfp/Fedora-Xfce-armhfp-22-3-sda.raw.xz

```

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
