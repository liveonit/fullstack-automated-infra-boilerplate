#!/bin/sh

set -a
. ./.env
set +a


# render a template configuration file
# expand variables + preserve formatting
render_template() {
  eval "echo \"$(cat $1)\""
}

filename="$(basename -- $1)"
result_file_name="$( echo "$filename" | sed -e 's#\.template##' )"
render_template "$1" > $2$result_file_name
