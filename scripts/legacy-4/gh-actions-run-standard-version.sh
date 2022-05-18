#!/bin/bash

VERSION_NAME=$1
FIRST_RELEASE=$2
PRERELEASE=$3
PRERELEASE_NAME=$4

echo ${#VERSION_NAME}
echo ${#FIRST_RELEASE}
echo ${#PRERELEASE}
echo ${#PRERELEASE_NAME}

# 1  - VERSION_NAME [+] - FIRST_RELEASE [ ] - PRERELEASE [ ] - PRERELEASE_NAME [?] v
# 2  - VERSION_NAME [ ] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?] v
# 3  - VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [ ] v
# 4  - VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [+] v


# 1 - VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?]
if [[ ! -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "false" ]]
then
  npx standard-version --release-as "$VERSION_NAME"

# 2 - VERSION_NAME [] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "false" ]]
then
  npx standard-version --first-release

# 3 - VERSION_NAME [] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME []
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "true" && -z $PRERELEASE_NAME ]]
then
  npx standard-version --prerelease

# 4 - VERSION_NAME [] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [+]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "true" && ! -z $PRERELEASE_NAME ]]
then
  npx standard-version --prerelease "$PRERELEASE_NAME"

else
  npx standard-version
fi