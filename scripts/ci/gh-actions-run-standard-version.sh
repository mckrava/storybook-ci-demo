#!/bin/bash

VERSION_NAME=$1
FIRST_RELEASE=$2
PRERELEASE=$3
PRERELEASE_NAME=$4

# VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [ ] - PRERELEASE_NAME [?]
# VERSION_NAME [+] - FIRST_RELEASE [ ] - PRERELEASE [ ] - PRERELEASE_NAME [?]
# VERSION_NAME [ ] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?]
# VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?]
# VERSION_NAME [ ] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [ ]
# VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [ ]
# VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [+]
# VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [ ]
# VERSION_NAME [+] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [ ]
# VERSION_NAME [ ] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [+]
# VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [+]


# VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [ ] - PRERELEASE_NAME [?]
if [[ -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "false" ]]
then
  npx standard-version
  echo "options - 1"

# VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?]
elif [[ ! -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "false" ]]
then
  npx standard-version --release-as "$VERSION_NAME"
  echo "options - 2"

# VERSION_NAME [] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "false" ]]
then
  npx standard-version --first-release
  echo "options - 3"

# VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?]
elif [[ ! -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "false" ]]
then
  npx standard-version --release-as "$VERSION_NAME" --first-release
  echo "options - 4"

# VERSION_NAME [] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME []
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "true" && -z $PRERELEASE_NAME ]]
then
  npx standard-version --first-release --prerelease
  echo "options - 5"

# VERSION_NAME [] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME []
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "true" && -z $PRERELEASE_NAME ]]
then
  npx standard-version --prerelease
  echo "options - 6"

# VERSION_NAME [] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [+]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "true" && ! -z $PRERELEASE_NAME ]]
then
  npx standard-version --prerelease "$PRERELEASE_NAME"
  echo "options - 7"

# VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME []
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "true" && -z $PRERELEASE_NAME ]]
then
  npx standard-version --release-as "$VERSION_NAME" --first-release --prerelease
  echo "options - 8"

# VERSION_NAME [+] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME []
elif [[ ! -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "true" && -z $PRERELEASE_NAME ]]
then
  npx standard-version --release-as "$VERSION_NAME"
  echo "options - 9"

# VERSION_NAME [] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [+]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "true" && ! -z $PRERELEASE_NAME ]]
then
  npx standard-version --first-release --prerelease "$PRERELEASE_NAME"
  echo "options - 10"

# VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [+]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "true" && ! -z $PRERELEASE_NAME ]]
then
  npx standard-version --release-as "$VERSION_NAME" --first-release  --prerelease "$PRERELEASE_NAME"
  echo "options - 11"

else
  npx standard-version
  echo "options - def"
fi