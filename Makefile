# Makefile CHEATSHEET: https://devhints.io/makefile
##############################################################################
# App : go test|run|build; docker build|push|pull|run|service|swarm|deploy
# ... all recipes for Docker and Golang builds, and app services (per se).
#
# For infra, configuration management (CM), and PostgreSQL HA,
# see Makefile(s) etal @ ./infra/, ./infra/docker/{nodes,services/stor/pgha}.
##############################################################################
include Makefile.settings
##############################################################################
# Meta

menu:
	clear
	$(INFO) 'Recipes'
	@echo '	prj   : Make project.'

prj:
	bash make.recipes.sh prj
