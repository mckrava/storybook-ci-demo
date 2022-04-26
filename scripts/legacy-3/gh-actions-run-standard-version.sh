#!/bin/bash

VERSION_NAME=$1
FIRST_RELEASE=$2
PRERELEASE=$3
PRERELEASE_NAME=$4

echo ${#VERSION_NAME}
echo ${#FIRST_RELEASE}
echo ${#PRERELEASE}
echo ${#PRERELEASE_NAME}

# 1  - VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [ ] - PRERELEASE_NAME [?] v
# 2  - VERSION_NAME [+] - FIRST_RELEASE [ ] - PRERELEASE [ ] - PRERELEASE_NAME [?] v
# 3  - VERSION_NAME [ ] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?] v
# 4  - VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?] -
# 5  - VERSION_NAME [ ] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [ ] -
# 6  - VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [ ] v
# 7  - VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [+] v
# 8  - VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [ ] -
# 9  - VERSION_NAME [+] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [ ] -
# 10 - VERSION_NAME [ ] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [+] -
# 11 - VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [+] -


# 1 - VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [ ] - PRERELEASE_NAME [?]
if [[ -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "false" ]]
then
  npx standard-version
  echo "options - 1"

# 2 - VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?]
elif [[ ! -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "false" ]]
then
  npx standard-version --release-as "$VERSION_NAME"
  echo "options - 2"

# 3 - VERSION_NAME [] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "false" ]]
then
  npx standard-version --first-release
  echo "options - 3"

# 4 - VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?]
elif [[ ! -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "false" ]]
then
  npx standard-version --release-as "$VERSION_NAME" --first-release
  echo "options - 4"

# 5 - VERSION_NAME [] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME []
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "true" && -z $PRERELEASE_NAME ]]
then
  npx standard-version --first-release --prerelease
  echo "options - 5"

# 6 - VERSION_NAME [] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME []
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "true" && -z $PRERELEASE_NAME ]]
then
  npx standard-version --prerelease
  echo "options - 6"

# 7 - VERSION_NAME [] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [+]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "true" && ! -z $PRERELEASE_NAME ]]
then
  npx standard-version --prerelease "$PRERELEASE_NAME"
  echo "options - 7"

# 8 - VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME []
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "true" && -z $PRERELEASE_NAME ]]
then
  npx standard-version --release-as "$VERSION_NAME" --first-release --prerelease
  echo "options - 8"

# 9 - VERSION_NAME [+] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME []
elif [[ ! -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "true" && -z $PRERELEASE_NAME ]]
then
  npx standard-version --release-as "$VERSION_NAME"
  echo "options - 9"

# 10 - VERSION_NAME [] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [+]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "true" && ! -z $PRERELEASE_NAME ]]
then
  npx standard-version --first-release --prerelease "$PRERELEASE_NAME"
  echo "options - 10"

# 11 - VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [+]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "true" && ! -z $PRERELEASE_NAME ]]
then
  npx standard-version --release-as "$VERSION_NAME" --first-release  --prerelease "$PRERELEASE_NAME"
  echo "options - 11"

else
  npx standard-version
  echo "options - def"
fi