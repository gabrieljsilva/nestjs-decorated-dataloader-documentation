export function Footer() {
	return (
		<footer className="w-full border-t">
			<div className="w-full flex justify-center items-center py-8">
				<p className="text-sm text-muted-foreground">
					© {new Date().getFullYear()} All rights reserved.
				</p>
			</div>
		</footer>
	);
}
