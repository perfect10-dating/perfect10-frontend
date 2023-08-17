#!/bin/bash
echo "************************"
echo "Handling swap file"
echo $(date)
echo "************************"
# if /etc/fstab doesn't contains swapfile command
if ! grep -q "swap" /etc/fstab; then
    sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=1024
    sudo /sbin/mkswap /var/swap.1
    sudo chmod 600 /var/swap.1
    sudo /sbin/swapon /var/swap.1
    sudo /sbin/swapon -s
    touch .swapmem
    echo "************************"
    echo "Adding swapfile to /etc/fstab"
    echo $(date)
    echo "************************"
    echo '/var/swap.1 swap swap defaults 0 0' | sudo tee -a /etc/fstab
fi
