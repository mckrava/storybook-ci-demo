#!/bin/bash

VERSION_NAME=$1
FIRST_RELEASE=$2
PRERELEASE=$3
PRERELEASE_NAME=$4

# VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [ ] - PRERELEASE_NAME [?]
# VERSION_NAME [ ] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?]
# VERSION_NAME [ ] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [ ]
# VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [ ]
# VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [+]
# VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [ ]
# VERSION_NAME [ ] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [+]
# VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [+]


# VERSION_NAME [ ] - FIRST_RELEASE [ ] - PRERELEASE [ ] - PRERELEASE_NAME [?]
if [[ -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "false" ]]
then
  npx standard-version

# VERSION_NAME [] - FIRST_RELEASE [+] - PRERELEASE [ ] - PRERELEASE_NAME [?]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "false" ]]
then
  npx standard-version --first-release

# VERSION_NAME [] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME []
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "true" && -z $PRERELEASE_NAME ]]
then
  npx standard-version --first-release --prerelease

# VERSION_NAME [] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME []
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "true" && -z $PRERELEASE_NAME ]]
then
  npx standard-version --prerelease

# VERSION_NAME [] - FIRST_RELEASE [ ] - PRERELEASE [+] - PRERELEASE_NAME [+]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "false" && $PRERELEASE == "true" && ! -z $PRERELEASE_NAME ]]
then
  npx standard-version --prerelease "$PRERELEASE_NAME"

# VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME []
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "true" && -z $PRERELEASE_NAME ]]
then
  npx standard-version --release-as "$VERSION_NAME" --first-release --prerelease

# VERSION_NAME [] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [+]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "true" && ! -z $PRERELEASE_NAME ]]
then
  npx standard-version --first-release --prerelease "$PRERELEASE_NAME"

# VERSION_NAME [+] - FIRST_RELEASE [+] - PRERELEASE [+] - PRERELEASE_NAME [+]
elif [[ -z $VERSION_NAME && $FIRST_RELEASE == "true" && $PRERELEASE == "true" && ! -z $PRERELEASE_NAME ]]
then
  npx standard-version --release-as "$VERSION_NAME" --first-release  --prerelease "$PRERELEASE_NAME"

else
  npx standard-version
fi